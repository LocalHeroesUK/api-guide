const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('../keys/jwt.key');

// Set your partner ID below
const partnerId = '5Sb4gLLeajcW';

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

console.log(`
\x1b[32mAdd the following header to your https request:\x1b[0m

\x1b[2mauthorization :\x1b[0m Bearer ${token}

\x1b[32mExample curl command:\x1b[0m

\x1b[2mcurl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer ${token}" -d '{ "query" : "query coverageByTaxonomy{ coverageByTaxonomy(area:\\"sa99\\", taxonomyId:\\"taxonomy/1\\")}" }' "https://services.localheroes.com/graphql"\x1b[0m
`);
