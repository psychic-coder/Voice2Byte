import fs from 'fs';
import { execSync } from 'child_process';

const JAEGER_API = process.env.JAEGER_API_URL || 'http://localhost:16686/api/traces';

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
    const url = operation ? `${JAEGER_API}?service=${encodeURIComponent(service)}&operation=${encodeURIComponent(operation)}&limit=1000` : `${JAEGER_API}?service=${encodeURIComponent(service)}&limit=1000`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error(`Failed to fetch traces for ${service} - ${operation}:`, err.message);
    return [];
  }
};

const spanNames = (trace) => (trace.spans || []).map((span) => span.operationName || 'unknown');

const classifyTrace = (trace) => {
  const names = spanNames(trace);
  const hasSTT = names.includes('STT_Processing');
  const hasLLM = names.includes('LLM_Processing');
  const hasVoiceRoute = names.some((name) => name.includes('/api/voice') || name.includes('/analyze'));

  if (hasSTT && hasLLM && hasVoiceRoute) {
    return 'full_voice_flow';
  }
  if (hasSTT && !hasLLM) {
    return 'stt_only';
  }
  if (hasLLM && !hasSTT) {
    return 'llm_only';
  }
  if (hasVoiceRoute) {
    return 'voice_route_no_ai';
  }
  return 'other';
};

const traceDurationMs = (trace, matcher) => {
  const relevantSpan = (trace.spans || []).find((span) => matcher(span.operationName || ''));
  return relevantSpan ? relevantSpan.duration / 1000 : null;
};

const runReport = async () => {
  console.log('📊 Generating Phase 5 Observability Latency Report...');
  
  console.log('⏳ Waiting 5 seconds for Jaeger to ingest recent traces...');
  await delay(5000);

  // Fetch traces broadly and then classify them so unrelated POST traffic does not pollute the report.
  const sttTraces = await fetchTraces('voice2bite-ai-backend', 'STT_Processing');
  const llmTraces = await fetchTraces('voice2bite-ai-backend', 'LLM_Processing');
  const nodeTraces = await fetchTraces('voice2bite-node-gateway');

  const classifiedNodeTraces = nodeTraces.map((trace) => ({
    trace,
    path: classifyTrace(trace),
  }));

  const e2eTraces = classifiedNodeTraces.filter(({ path }) => path === 'full_voice_flow');

  const sttDurations = sttTraces
    .flatMap((trace) => trace.spans.filter((span) => span.operationName === 'STT_Processing').map((span) => span.duration / 1000));
  const llmDurations = llmTraces
    .flatMap((trace) => trace.spans.filter((span) => span.operationName === 'LLM_Processing').map((span) => span.duration / 1000));

  const e2eDurations = e2eTraces
    .map(({ trace }) => traceDurationMs(trace, (name) => name.includes('/api/voice') || name.includes('/analyze')))
    .filter((value) => value !== null);

  const pathCounts = classifiedNodeTraces.reduce((accumulator, { path }) => {
    accumulator[path] = (accumulator[path] || 0) + 1;
    return accumulator;
  }, {});

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
  - Node trace path breakdown: **${JSON.stringify(pathCounts)}**

### Latency Percentiles (in milliseconds)

| Metric | P50 (Median) | P95 | P99 |
|--------|--------------|-----|-----|
| **End-to-End Voice Round-Trip** | ${e2eMetrics.p50.toFixed(2)} ms | ${e2eMetrics.p95.toFixed(2)} ms | ${e2eMetrics.p99.toFixed(2)} ms |
| **STT (Whisper) Processing** | ${sttMetrics.p50.toFixed(2)} ms | ${sttMetrics.p95.toFixed(2)} ms | ${sttMetrics.p99.toFixed(2)} ms |
| **LLM (Gemini) Processing** | ${llmMetrics.p50.toFixed(2)} ms | ${llmMetrics.p95.toFixed(2)} ms | ${llmMetrics.p99.toFixed(2)} ms |

### Analysis
The results separate real voice requests from unrelated POST traffic before computing percentiles. Any trace that does not include both STT and LLM spans is excluded from the end-to-end latency table and categorized in the path breakdown above.

*(Generated automatically via OTLP traces)*
`;

  fs.writeFileSync('latency_report.md', report);
  console.log('✅ Report saved to latency_report.md');
  console.log(report);
};

runReport();
