const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./jwt.key');

// Set your partner ID below
const partnerId = 'xxxxxxxxxx';

const JWTHeader = {
  alg: 'RS256',
  typ: 'JWT'
};
const now = Math.floor(Date.now() / 1000);

let JWTPayload = {
  iss: 'partner',
  aud: 'localheroes',
  iat: now,
  exp: now + 60,
  sub: partnerId,
  "lh:partner": partnerId,
};

const token = jwt.sign(JWTPayload, privateKey, {
    algorithm: 'RS256',
    header: JWTHeader,
});

console.log(token);
