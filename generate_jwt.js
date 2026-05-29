const crypto = require('crypto');

function base64url(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

const header = { alg: 'HS256', typ: 'JWT' };
const payload = {
  aud: 'authenticated',
  exp: Math.floor(Date.now() / 1000) + 3600,
  sub: '00000000-0000-0000-0000-000000000001',
  email: 'reza@sgd-corp.com',
  role: 'authenticated'
};

const encodedHeader = base64url(JSON.stringify(header));
const encodedPayload = base64url(JSON.stringify(payload));
const signatureInput = `${encodedHeader}.${encodedPayload}`;

const secret = 'Jpygq3D5NFlsvG0gI3X4YegyMwbdbf7O';
const signature = crypto.createHmac('sha256', secret).update(signatureInput).digest('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

const jwt = `${signatureInput}.${signature}`;
console.log(jwt);
