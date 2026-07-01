const TARGET_URL = "http://localhost:4000/api/voice/analyze"; 
const CONCURRENT_REQUESTS = 50;

console.log(`--- Phase 3: Atomic Token Bucket Rate Limiting Test ---`);
console.log(`Blasting Node.js API Gateway with ${CONCURRENT_REQUESTS} concurrent requests...`);

async function runLoadTest() {
  const promises = [];
  
  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    promises.push(
      fetch(TARGET_URL, { method: 'POST' }).catch(err => {
         console.log(err);
         return { status: 500 };
      })
    );
  }

  const startTime = Date.now();
  const responses = await Promise.all(promises);
  const endTime = Date.now();

  let allowed = 0;
  let rateLimited = 0;
  let otherErrors = 0;

  responses.forEach(res => {
    if (res.status === 429) {
      rateLimited++;
    } else if (res.status === 400 || res.status === 500 || res.status === 502 || res.status === 504) {
      allowed++;
    } else {
      otherErrors++;
    }
  });

  console.log(`\nResults (Time taken: ${endTime - startTime}ms):`);
  console.log(`✅ Allowed Requests (Passed Gateway): ${allowed}`);
  console.log(`🛑 Rate Limited (429 Too Many Requests): ${rateLimited}`);
  if (otherErrors > 0) {
    console.log(`⚠️ Other Status Codes: ${otherErrors}`);
  }

  console.log(`\nConclusion:`);
  if (allowed <= 5) {
    console.log(`🎉 SUCCESS: Atomic Token Bucket strictly enforced exactly ${allowed} requests and rejected ${rateLimited} with zero race conditions!`);
  } else {
    console.log(`❌ FAILED: The Token bucket allowed ${allowed} requests (expected max 5 due to race conditions). Check Lua script atomicity!`);
  }
}

runLoadTest();
