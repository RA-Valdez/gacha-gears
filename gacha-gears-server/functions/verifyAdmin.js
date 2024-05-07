const jose = require('jose');

async function verifyAdmin(token) {
  try {
    // Test Verify
    const { payload, protectedHeader } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.API_KEY), {
      issuer: process.env.API_ISSUER,
      audience: process.env.API_AUDIENCE,
    });
    return payload.role == 'admin';
  } catch (err) {
    return false;
  }
}

module.exports = verifyAdmin;