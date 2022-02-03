# twitter-demo

## Setup

- `yarn install`
- `cp .env.example .env`
- set Twitter access token in `.env`

### Run demo scripts

```shell
node src/scripts/publishing-profile.js # get publishing profiles (Twitter user profile)

node src/scripts/followers.js 1466796521412771840 # get followers - pass profileId as parameter

node src/scripts/find-posts-by-hashtag.js apis # find posts by hashtag - pass hashtag as parameter

node src/scripts/find-posts-by-mention.js 1466796521412771840 # find posts by mention - pass profileId as parameter

node src/scripts/publish-post.js "your tweet text" # publish post (tweet)
```
