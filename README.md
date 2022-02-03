# twitter-demo

## Setup

- `yarn install`
- `cp .env.example .env`
- set Twitter credentials in .env file (see Twitter project and application setup section)
- yarn start or yarn start:dev
- visit http://localhost:3000

### Twitter project and application setup

You need to obtain Twitter application ID and secret. We recommend to try the demo with dedicated testing Twitter account.

- go to https://developer.twitter.com/ and either sign up for a new account or sign in with existing one
- sign up for Essential access; you will need to verify a phone number for your Twitter account
- create a project and application (Essential account is limited to a single project and application)
- in application settings generate OAuth 2.0 Client ID and Client Secret and paste them into `.env` file; mind that you cannot view the secret again later, only regenerate it

### Run demo scripts

First you need to copy Twitter access token from http://localhost:3000/account page to .env TWITTER_ACCESSTOKEN env variable to be able to run following demo scripts.

```shell
node src/scripts/publishing-profile.js # get publishing profiles (Twitter user profile)

node src/scripts/followers.js 1466796521412771840 # get followers - pass profileId as parameter

node src/scripts/find-posts-by-hashtag.js apis # find posts by hashtag - pass hashtag as parameter

node src/scripts/find-posts-by-mention.js 1466796521412771840 # find posts by mention - pass profileId as parameter

node src/scripts/publish-post.js "your tweet text" # publish post (tweet)
```
