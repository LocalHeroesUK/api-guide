# Generate JWT

This node.js example generates a valid JWT for use with our API.  Once created, you need to add it to your `Authorization` header, prefixed with `Bearer ` followed by space.

## Installation

```bash
$ npm i
$ node ./generateJWT.js
```

Sample output: -
```bash
15:10 $ node ./generateJWT.js

Add the following header to your https request:

authorization : Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwYXJ0bmVyIiwiYXVkIjoibG9jYWxoZXJvZXMiLCJpYXQiOjE1MzUxMTk4MzEsImV4cCI6MTUzNTExOTg5MSwic3ViIjoiNVNiNGdMTGVhamNXIiwibGg6cGFydG5lciI6IjVTYjRnTExlYWpjVyJ9.KNcOj-ePfFeBm0Rmliz_UAVlRk0HhkMXFnIMRtIHV_NCW6rPCtXu7Z-IAIpAfQmubCpVNzYS0AUlUZXSJn5ye53bNHFvdqTNpiqevRnB6WuzcdmVQ8TP87zcMnkT-174_tJemGfOepFih2AGILOjjvUCQbdrXOf1SM9dgoQrXa2QiJ1rlw08AipINgEruUosgGu3l-KN5149YZ3fDw2_lmCLmTx__NkWVOxH4GQZPQaALt7J9QV4ZSh7C5LQNLM9QvuMEpwq69-kxwjQKwD3xnjC93yE8We--OgQh3Zu9STBAun3_fPSAXikFvg40Ego2oTHLam0TXoOSUevzojPFQ
```