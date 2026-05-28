const crypto = require('crypto');

// Secret sesuai dengan yang Anda ketik di gambar sebelumnya
const secret = 'SgdCareKunciRahasiaMasterJWT2026Aman'; 

function generateJWT(role) {
  // 1. Buat Header
  const headerObj = { alg: 'HS256', typ: 'JWT' };
  const header = Buffer.from(JSON.stringify(headerObj)).toString('base64url');
  
  // 2. Buat Payload
  const payloadObj = { role: role, iss: 'supabase', iat: 1704067200, exp: 1893456000 };
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  
  // 3. Buat Signature dengan HMAC SHA256
  const signature = crypto.createHmac('sha256', secret)
                          .update(header + '.' + payload)
                          .digest('base64url');
                          
  return `${header}.${payload}.${signature}`;
}

console.log('\n=============================================');
console.log('🚀 HASIL GENERATE KUNCI SUPABASE ANDA');
console.log('=============================================\n');

console.log('📌 1. Kopi ini untuk ANON_KEY:');
console.log(generateJWT('anon'));

console.log('\n📌 2. Kopi ini untuk SERVICE_ROLE_KEY:');
console.log(generateJWT('service_role'));
console.log('\n=============================================');
