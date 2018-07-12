# Local Heroes API Guide

Welcome to the Local Heroes developer page. Our API allows affiliates to send leads directly to the Local Heroes platform.

## Before integrating you should:

-Have a commercial agreement with us regarding the leads you will send
-Have an understanding of which taxonomies you are subscribed to
-Have a Partner ID
-If you have any questions, please email apiteam@localheroes.com or speak to your Local Heroes account manager.

## Getting started
* [Create Keys](#create-keys)
* [JWT Structure](#jwt-structure)
* [Create Job API](#create-job-api)
* [Create Job API sandbox](#create-job-api-sandox)
* [Response Codes](#response-codes)

#### Create keys
To authenticate against our API you will need JSON Web Tokens (JWT) keys. To get started, please generate two pairs of public and private keys - one for sandbox and one for production. When you are ready, share your public keys with us specifying which will be used for sandbox and which will be used for production.

```bash
ssh-keygen -t rsa -b 2048 -f ./jwt.key
# Don't add passphrase!!
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
cat jwt.key
cat jwt.key.pub
```

####  JWT Structure

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
To create a New Job you'll need to use a graph ql mutation. We can recommend the use of GraphQL Playground.
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
| job.taxonomyId | NO | Provided by LocalHeroes |
|customer.mobile	|NO|	Should be UK format beginning 07|
|customer.name	|NO|	Name of customer|
|customer.email	|NO	|Email of customer for contact purposes|
#### Create Job API sandbox

We recommend that you first try creating a Job using our API Sandbox.

We use the following Special postcodes for error triggering:

| PostCode  | Error |
| ------------- | ------------- |
| SA99 1AA  | Area not covered  |
| SA99 1AB  | Daily jobs creation limit reached  |
|SA99 1AC|	Request not authorized|

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
|100|	Daily jobs creation limit reached|	Daily jobs creation limit reached
|101|	Area not covered|	The area specified in the request is not covered by our traders
|104|	Request not authorized|	There is a problem with your JWT
|105|	Invalid Token|	There is a problem with your JWT
|106|	Access Token Expired|	The JWT provided is older than 30 seconds
|107|	Access Denied|	JWT format correct but incorrect permisions
|108|	Keys not found|	Keys must be provided and the correct ones
|109|	JWT verification error|	This is a generic error on the JWT
|110|	Email invalid|	Email is invalid or has not been provided
