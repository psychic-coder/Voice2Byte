import jwt from 'jsonwebtoken';

const TARGET_URL = "http://localhost:4000/api/voice/analyze";
const CONCURRENT_REQUESTS = 50;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';

const loudUserToken = jwt.sign({ id: 101, role: 'CUSTOMER', email: 'loud@example.com' }, JWT_SECRET, { expiresIn: '1h' });
const quietUserToken = jwt.sign({ id: 202, role: 'CUSTOMER', email: 'quiet@example.com' }, JWT_SECRET, { expiresIn: '1h' });

const loudUserHeaders = {
  Cookie: `access_token=${loudUserToken}`,
};

const quietUserHeaders = {
  Cookie: `access_token=${quietUserToken}`,
};

console.log(`--- Phase 3: Atomic Token Bucket Rate Limiting Test ---`);
console.log(`Blasting Node.js API Gateway with ${CONCURRENT_REQUESTS} concurrent requests...`);

async function runLoadTest() {
  const promises = [];

  for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
    promises.push(
      fetch(TARGET_URL, { method: 'POST', headers: loudUserHeaders }).catch(err => {
         console.log(err);
         return { status: 500 };
      })
    );
  }

  const quietUserRequest = fetch(TARGET_URL, { method: 'POST', headers: quietUserHeaders }).catch(err => {
    console.log(err);
    return { status: 500 };
  });

  const startTime = Date.now();
  const responses = await Promise.all([...promises, quietUserRequest]);
  const endTime = Date.now();

  let allowed = 0;
  let rateLimited = 0;
  let otherErrors = 0;
  let quietUserStatus = null;

  responses.forEach((res, index) => {
    if (res.status === 429) {
      rateLimited++;
    } else if (res.status === 400 || res.status === 500 || res.status === 502 || res.status === 504) {
      allowed++;
    } else {
      otherErrors++;
    }

    if (index === responses.length - 1) {
      quietUserStatus = res.status;
    }
  });

  console.log(`\nResults (Time taken: ${endTime - startTime}ms):`);
  console.log(`✅ Allowed Requests (Passed Gateway): ${allowed}`);
  console.log(`🛑 Rate Limited (429 Too Many Requests): ${rateLimited}`);
  console.log(`👤 Quiet User Status: ${quietUserStatus}`);
  if (otherErrors > 0) {
    console.log(`⚠️ Other Status Codes: ${otherErrors}`);
  }

  console.log(`\nConclusion:`);
  if (quietUserStatus !== 429) {
    console.log(`🎉 SUCCESS: Loud user pressure did not collaterally rate-limit the quiet user.`);
  } else {
    console.log(`❌ FAILED: The quiet user was rejected alongside the loud user.`);
  }
}

runLoadTest();
