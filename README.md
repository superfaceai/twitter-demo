# twitter-demo

## Setup

1. `npm i`
2. `cp .env.example .env`
3. set Twitter credentials in .env file (see below)
4. get Access and Refresh tokens (see below)

### Twitter project and application setup

You need to obtain Twitter application ID and secret. We recommend to try the demo with dedicated testing Twitter account.

- go to https://developer.twitter.com/ and either sign up for a new account or sign in with existing one
- sign up for Essential access; you will need to verify a phone number for your Twitter account
- create a project and application (Essential account is limited to a single project and application)
- in application settings
  - generate OAuth 2.0 Client ID and Client Secret and paste them into `.env` file; mind that you cannot view the secret again later, only regenerate it
  - add callback URL to `http://localhost:3000/auth/twitter/callback` (you can change the port and address if you also adjust `BASE_URL` in `.env` accordingly)

### Obtaining Access and Refresh tokens

This repository contains an HTTP server which implements OAuth authorization flow. Upon successful authorization, it will output the tokens in a JSON string, stored in `tokens.json` file:

1. Run `npm start`
2. Visit `http://localhost:3000`
3. Authorize application to access your account
4. The `tokens.json` file should be created

Alternatively run `get-tokens.js` script and paste the generated JSON manually.

### Run demo scripts

```shell
node scripts/publishing-profiles.js # get publishing profiles (Twitter user profile)

node scripts/followers.js 1466796521412771840 # get followers - pass profileId as parameter

node scripts/find-posts-by-hashtag.js apis # find posts by hashtag - pass hashtag as parameter

node scripts/find-posts-by-mention.js 1466796521412771840 # find posts by mention - pass profileId as parameter

node scripts/publish-post.js "your tweet text" # publish post (tweet)
```
