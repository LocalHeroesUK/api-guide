# Local Heroes API Guide

Welcome to the Local Heroes developer page. Our API allows affiliates to send leads directly to the Local Heroes platform. Our API uses GraphQL over HTTPS, and is secured using JSON Web Tokens (JWTs).

## Before integrating you should:

* Have a commercial agreement with us regarding the leads you will send
* Have an understanding of which taxonomies you are subscribed to
* Have a Partner ID
* Have a basic understanding of [GraphQL](https://graphql.org/) and [JWT](https://jwt.io/)

If you have any questions, please email apiteam@localheroes.com or speak to your Local Heroes account manager.

## Getting started
* [Create Keys](#create-keys)
* [JWT Structure](#jwt-structure)
* [Create Job API](#create-job-api)
* [Create Job API sandbox](#create-job-api-sandbox)
* [Response Codes](#response-codes)

## Create keys
To authenticate against our API you will need to create a JSON Web Token (JWT) signed with your private key. To get started, please generate two pairs of public and private keys - one for sandbox and one for production. When you are ready, share your _public_ keys with us specifying which will be used for sandbox and which will be used for production.

```bash
$ ssh-keygen -t rsa -b 2048 -f ./jwt.key -m PEM
# Don't add passphrase!!
$ cat jwt.key
$ ssh-keygen -f jwt.key.pub -e -m pkcs8
```

If this doesn't work on your machine you might like to try using [Docker](./docker-keygen.md). Keys should have same format as in [examples/keys](./examples/keys)

##  JWT Structure

To access our API you will need to create a JWT that you will pass as a bearer token in your HTTPS requests. This JWT has to be generated with every new request. The format of the JWT is: -

Header
```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

Payload
```json
{
  "iss": "partner",
  "lh:partner": "ID_PARTNER",
  "iat": 1516239022,
  "environment": "SANDBOX || PRODUCTION"
}
```

If you are using nodeJS, you can use our [demo tool](./examples/node) to generate your JWT.

If you are using a different programming language then visit [jwt.io](https://jwt.io/) for other library implementations.

## URL

The URL for all API requests is the same.  The content of your POST request describes the action you want to take: -

`https://services.localheroes.com/graphql`


## Check coverage

To check that we can cover a particular taxonomy item in a postcode use our `coverageByTaxonomy` query.

E.g. 
```graphql
query coverageByTaxonomy{
  coverageByTaxonomy(area:"sa99", taxonomyId:"lhrn:uk:taxonomy:affiliate/xxxx")
}
```

You need to use the authorization header, as described above.

HTTP Headers

- `Authorization: Bearer JWT_TOKEN_HERE`

The response can be one of three values: -

* `true` - We do have coverage
* `false` - We do not have coverage
* An error condition reported in the error object. E.g. 'high demand'.  In exceptional circumstances we may report high demand for a particular speciality in a localized area.  If this happens we will not take on any more jobs, as the chances of finding a trader are low.  It is better that we let the customer know ASAP, so that they can look elsewhere.

## Coverage sandbox

We recommend that you first try checking coverage using our API Sandbox.
We use the following special postcodes and taxonomies for coverage checking:

| TaxonomyId  | PostCode | Response |
| ------------| -------- | -------- |
| ---         | SA99 |  Error: High demand  |
| taxonomy/1  | ---  | true  |
| taxonomy/2<sup>*</sup> | --- | false |

<sup>*</sup> Or any other taxonomy apart from `taxonomy/1`

Here is an example of how to check coverage using the `curl` command: -

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer xxxxx.xxxxx.xxxxx" -d '{ "query" : "query coverageByTaxonomy{ coverageByTaxonomy(area:\"sa99\", taxonomyId:\"lhrn:uk:taxonomy:affiliate/xxxx\")}" }
' "https://services.localheroes.com/graphql"

```

For simplicity I have placed the variables inline with the GraphQL query.  In practice it is better to separate out "query" and "variables" as separate properties in your JSON payload.

N.b. you need to replace xxxxx.xxxxx.xxxxx with your JWT created above.

We recommend using the [GraphQL Playground](https://github.com/prismagraphql/graphql-playground) tool for testing your GraphQL queries. 

## Create Job API
To create a New Job you'll need to use a [GraphQL](https://graphql.org/) mutation.

```graphql
mutation TO_BE_CHANGED_createJob($input: job_InputCreateJob!) {
  job_createJob(input: $input) { id }
}
```
The mutation name here has to be changed to match the name of your company example: `mutation localHeroes_createJob`. Do not change anything else in this mutation.
Here is an example of the variables you have to pass to that mutation:

```js
{
  variables: {
    input: {
      job: {
        postCode: "SA99 1AA",
        taxonomyId: "lhrn:uk:taxonomy:affiliate/xxx",
        address1: "CUSTOMER_ADDRESS_LINE_1",
        timeslots: {
          startDateTime: "2018-06-13T07:00:00Z",
          endDateTime: "2018-06-13T11:00:00Z",
        },
        description: "JOB_DESCRIPTION",
        address2: "CUSTOMER_ADDRESS_LINE_2",
        address3: "CUSTOMER_ADDRESS_LINE_3",
      },
      customer: {
        email: "CUSTOMER_EMAIL",
        mobile: "CUSTOMER_MOBILE_NUMBER",
        firstName: "CUSTOMER_FIRST_NAME",
        lastName: "CUSTOMER_LAST_NAME",
      },
    }
  }
}
```

| Data  | Optional | Notes |
| ------------- | ------------- | ------------- |
| job.postCode | NO | The space in the middle is not necessary  |
| job.address1 | NO | Limit: 255 characters |
| job.address2 | YES | Limit: 255 characters |
| job.address3 | YES | Limit: 255 characters |
| job.description | YES | Limit: 1024 characters |
| job.taxonomyId | NO | Provided by LocalHeroes |
| job.timeSlot | YES | The object containing the timeSlot informations|
| job.timeSlot.startDateTime | NO | The start time of the timeSlot - If none given then value should be null |
| job.timeSlot.endDateTime | NO | The end time of the timeSlot - If none given then value should be null |
|customer.mobile	|NO|	Mobile and landline numbers accepted|
|customer.firstName |NO|	First name of customer|
|customer.lastName |NO|	Last name of customer|
|customer.email	|NO	|Email of customer for contact purposes|

#### HTTP Headers

- `Authorization: Bearer JWT_TOKEN_HERE`
- `Referrer: YOUR_COMPANY_NAME`
- `Content-Type: application/json`

#### Example

`data` here should be your 
```js
const mutation = `
  mutation {TO_BE_CHANGED}_createJob($input: job_InputCreateJob!) {
    job_createJob(input: $input) { id }
  }
`;

const variables: {
  input: { job: { ...jobData }, customer: { ...customerData } },
};

fetch('https://services.localheroes.com/graphql', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${YOUR_JWT}`,
    'Referrer': '{YOUR_COMPANY_NAME}',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    mutation,
    variables,
  }),
});
```

### Create Job API sandbox

We recommend that you first try creating a Job using our API Sandbox.
We use the following Special postcodes for error triggering:

| PostCode  | Error |
| ------------- | ------------- |
| SA99 1AA  | Area not covered  |
| SA99 1AB  | Daily jobs creation limit reached  |
|SA99 1AD|	Request not authorized|


## Response Codes

### HTTP Status Codes

|Code|Text|Description|
|--- |--- |--- |
|200|OK|Success!|
|401|Unauthorized|Missing or incorrect authentication credentials. This may also returned in other undefined circumstances.|
|403|Forbidden|The request is understood, but it has been refused or access is not allowed. An accompanying error message will explain why.|
|404|Not Found|The URI requested is invalid or the resource requested, does not exist.|
|429|Too Many Requests|Returned when a request cannot be served due to the application’s rate limit having been exhausted|
|500|Internal Server Error|Something is broken. This is usually a temporary error, for example in a high load situation or if an endpoint is temporarily having issues.|

### Error Messages
Error messages are returned in JSON format. For example, an error might look like this:

```json
{
  "errors": [
    {
      "message": "Invalid parameter email",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "job_createJob"
      ],
      "extensions": {
        "invalidFields": {
          "email": "INVALID_FORMAT"
        },
        "code": "BAD_USER_INPUT",
        "exception": {
          "invalidFields": {
            "email": "INVALID_FORMAT"
          }
        }
      }
    }
  ],
}
```

### Authentication Error Codes

The error code can be found in `errors[index].code`

|Code|Text|Description|
|--- |--- |--- |
|100|	Daily jobs creation limit reached|  Daily jobs creation limit reached
|101|	Area not covered|	The area specified in the request is not covered by our traders
|104|	Request not authorized| There is a problem with your JWT
|105|	Invalid Token|  There is a problem with your JWT
|106|	Access Token Expired|	The JWT provided is older than 30 seconds
|107|	Access Denied|	JWT format correct but incorrect permisions
|108|	Keys not found|	Keys must be provided and the correct ones
|109|	JWT verification error|	This is a generic error on the JWT

### Logic Error Codes

The error code can be found in `errors[index].extensions.code`

|Code|Text|Description|
|--- |--- |--- |
|BAD_USER_INPUT|  Invalid parameter [list of parameters (example: firstName, lastName)]|  One of the following input is badly formatted (INVALID_FORMAT) or empty (EMPTY)
|NOT_AUTHORIZED|  You are not authorized to create this type of job|  You do not have the permissions to create that type of job. Please contact your LocalHeroes representative
|NOT_AUTHORIZED|  You do not have permission to skip the coverage check|  You do not have the permissions to skip the coverage check. Please contact your LocalHeroes representative
|AREA_NOT_COVERED|  Area not covered| We do not have any hero available to cover this area
|TRADER_NOT_ELIGIBLE| Trader with id: {{TRADER_ID}} is not eligible for this job|  The assigned trader is not eligible to cover this type of work in this area
|JOB_CREATION_ERROR|  Failed to create job: {{error}}|  There was an error creating the job, please see the message for more information
