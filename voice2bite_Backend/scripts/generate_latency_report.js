import fs from 'fs';
import { execSync } from 'child_process';

const JAEGER_API = process.env.JAEGER_API_URL || 'http://jaeger:16686/api/traces';

// Simple delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const calculatePercentiles = (values) => {
  if (values.length === 0) return { p50: 0, p95: 0, p99: 0 };
  
  const sorted = values.sort((a, b) => a - b);
  
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  
  return { p50, p95, p99 };
};

const fetchTraces = async (service, operation) => {
  try {
    const url = `${JAEGER_API}?service=${encodeURIComponent(service)}&operation=${encodeURIComponent(operation)}&limit=1000`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error(`Failed to fetch traces for ${service} - ${operation}:`, err.message);
    return [];
  }
};

const runReport = async () => {
  console.log('📊 Generating Phase 5 Observability Latency Report...');
  
  console.log('⏳ Waiting 5 seconds for Jaeger to ingest recent traces...');
  await delay(5000);

  // Fetch AI backend traces
  const sttTraces = await fetchTraces('voice2bite-ai-backend', 'STT_Processing');
  const llmTraces = await fetchTraces('voice2bite-ai-backend', 'LLM_Processing');
  
  // Extract durations (Jaeger returns duration in microseconds)
  const sttDurations = sttTraces.flatMap(trace => trace.spans.filter(s => s.operationName === 'STT_Processing').map(s => s.duration / 1000));
  const llmDurations = llmTraces.flatMap(trace => trace.spans.filter(s => s.operationName === 'LLM_Processing').map(s => s.duration / 1000));

  // Also calculate end-to-end (Node gateway)
  const nodeTraces = await fetchTraces('voice2bite-node-gateway', 'POST');
  const e2eDurations = nodeTraces.flatMap(trace => trace.spans.filter(s => s.operationName === 'POST').map(s => s.duration / 1000));

  const sttMetrics = calculatePercentiles(sttDurations);
  const llmMetrics = calculatePercentiles(llmDurations);
  const e2eMetrics = calculatePercentiles(e2eDurations);
  
  // Generate Report
  const report = `
## Phase 5: Voice Pipeline Latency Report

This report was generated using distributed traces from the vendor-neutral Jaeger OpenTelemetry stack.

### Trace Counts
- Total End-to-End Traces captured: **${e2eDurations.length}**
- Total STT Processing Traces captured: **${sttDurations.length}**
- Total LLM Processing Traces captured: **${llmDurations.length}**

### Latency Percentiles (in milliseconds)

| Metric | P50 (Median) | P95 | P99 |
|--------|--------------|-----|-----|
| **End-to-End Voice Round-Trip** | ${e2eMetrics.p50.toFixed(2)} ms | ${e2eMetrics.p95.toFixed(2)} ms | ${e2eMetrics.p99.toFixed(2)} ms |
| **STT (Whisper) Processing** | ${sttMetrics.p50.toFixed(2)} ms | ${sttMetrics.p95.toFixed(2)} ms | ${sttMetrics.p99.toFixed(2)} ms |
| **LLM (Gemini) Processing** | ${llmMetrics.p50.toFixed(2)} ms | ${llmMetrics.p95.toFixed(2)} ms | ${llmMetrics.p99.toFixed(2)} ms |

### Analysis
The results demonstrate the strict division of labor across the microservices. The AI Backend (Python) natively handles the compute-heavy STT and LLM workloads, while the API Gateway (Node.js) orchestrates the asynchronous queuing and rate-limiting to protect the system.

*(Generated automatically via OTLP traces)*
`;

  fs.writeFileSync('latency_report.md', report);
  console.log('✅ Report saved to latency_report.md');
  console.log(report);
};

runReport();
