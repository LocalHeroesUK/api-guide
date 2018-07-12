# api-guide

## Documentation
* [Create Keys](#create-keys)
* [JWT](#jwt)
* [Create Job API](#create-job-api)
* [Create Job API mock](#create-job-api-mock)
* [Response Codes](#response-codes)

#### Create keys

```bash
ssh-keygen -t rsa -b 2048 -f ./jwt.key
# Don't add passphrase!!
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
cat jwt.key
cat jwt.key.pub
```

####  JWT

- Header
```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```
- Payload
```json
{
  "iss": "partner",
  "lh:partner": "ID_PARTNER",
  "iat": 1516239022
}
```

#### Create Job API
```graphql
mutation {
  createJob(
    newJob: {
      job: {
        description: "DESCRIPTION FOR THE JOB"
        address: "CUSTOMER_ADDRESS"
        postCode: "SA99 1AA"
        partnerId: "ID_PARTNER"
        jobType: STANDARD
        ...
      }
      customer:{
        name: "CUSTOMER_NAME"
        mobile: "CUSTOMER_CONTACT"
        ...
      }
    }
  ){
    id
  }
}
```
- Header request
```json
    {
      "Authorization" : "Bearer JWT_TOKEN_HERE"
    }
```

| Data  | Optional | Notes |
| ------------- | ------------- | ------------- |
| job.postCode | NO | The space in the middle is not necessary  |
| job.address | NO | Limit: 255 characters |
| job.description | YES | Limit: 1024 characters |
| job.partnerId | NO | Provided by LocalHeroes |
| job.jobType | YES |  |
| customer.mobile | NO |  |
| customer.name | NO |  |

#### Create Job API mock

Special postcodes for error triggering 

| PostCode  | Error |
| ------------- | ------------- |
| SA99 1AA  | Area not covered  |
| SA99 1AB  | Daily jobs creation limit reached  |


### Response Codes

#### HTTP Status Codes

|Code|Text|Description|
|--- |--- |--- |
|200|OK|Success!|
|401|Unauthorized|Missing or incorrect authentication credentials. This may also returned in other undefined circumstances.|
|403|Forbidden|The request is understood, but it has been refused or access is not allowed. An accompanying error message will explain why.|
|404|Not Found|The URI requested is invalid or the resource requested, does not exist.|
|429|Too Many Requests|Returned when a request cannot be served due to the application’s rate limit having been exhausted|
|500|Internal Server Error|Something is broken. This is usually a temporary error, for example in a high load situation or if an endpoint is temporarily having issues.|

#### Error Messages
Error messages are returned in JSON format. For example, an error might look like this:

```json
{
  "errors":[{
    "message": "Area not covered",
    "code": 101
  }]
}
```

#### Error Codes

|Code|Text|Description|
|--- |--- |--- |
|100|Daily jobs creation limit reached|Daily jobs creation limit reached|
|101|Area not covered|The area specified in the request is not covered by our traders|
|102|Job Type not allowed||
|104|Request not authorized||
|105|Invalid Token||
|106|Access Token Expired||
|107|Access Denied||
|108|Keys not found||
|109|JWT verification error||
