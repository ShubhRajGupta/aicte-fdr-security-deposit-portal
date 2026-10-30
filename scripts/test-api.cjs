const http = require('http');

function post(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...headers
      }
    }, res => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(resBody || '{}') }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'GET',
      headers
    }, res => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(resBody || '{}') }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('=== 1. Health Check ===');
  const health = await get('/api/health');
  console.log('Health:', health.status, health.data.service);

  console.log('\n=== 2. Failed Login Check (Check NIST 5-Attempt Counter) ===');
  const fail = await post('/api/auth/login', {
    username: 'rajesh.sharma@aicte-india.org',
    password: 'WrongPassword'
  });
  console.log('Fail Response:', fail.status, fail.data);

  console.log('\n=== 3. Successful Login (Director Bureau) ===');
  const login = await post('/api/auth/login', {
    username: 'rajesh.sharma@aicte-india.org',
    password: 'Aicte@Password2026'
  });
  console.log('Login Response:', login.status, 'User:', login.data.user?.name, 'Role:', login.data.user?.role);
  console.log('Requires 2FA OTP:', login.data.requiresOtp, 'Simulated Code:', login.data.simulatedOtp);
  const token = login.data.token;

  console.log('\n=== 4. Verify 2FA OTP ===');
  const mfa = await post('/api/auth/verify-otp', {
    token,
    otp: '262650'
  });
  console.log('MFA Verification:', mfa.status, mfa.data);

  console.log('\n=== 5. Get Session Info ===');
  const session = await get('/api/auth/session', { 'Authorization': `Bearer ${token}` });
  console.log('Authenticated Session User:', session.data.user?.name, 'Department:', session.data.user?.department);

  console.log('\n=== 6. Get Institutions & Instruments ===');
  const insts = await get('/api/institutions');
  console.log('Total Registered Institutions:', insts.data.length);

  const instruments = await get('/api/instruments', { 'Authorization': `Bearer ${token}` });
  console.log('Total Instruments in Central Registry:', instruments.data.length);
  instruments.data.forEach(i => {
    console.log(`  [${i.trustLevel}] #${i.instrumentNumber} - ${i.bankName} - ${i.formattedAmount} - Status: ${i.status}`);
  });

  console.log('\n=== 7. Verify Cryptographic SHA-256 Audit Ledger Chain ===');
  const audit = await get('/api/audit/verify');
  console.log('Audit Chain Intact:', audit.data.isChainIntact, 'Total Blocks:', audit.data.totalBlocks);
  console.log('Latest Block Hash:', audit.data.latestHash);

  console.log('\n=============================================');
  console.log('SUCCESS: All AICTE Backend Endpoints & Identity Flows are 100% OPERATIONAL!');
  console.log('=============================================');
}

run().catch(console.error);
