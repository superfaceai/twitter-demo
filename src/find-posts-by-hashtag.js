const { inspect } = require('node:util');
const dotenv = require('dotenv');
const { SuperfaceClient } = require('@superfaceai/one-sdk');

dotenv.config();

const findPostsByHashtag = async (hashtag) => {
  const sdk = new SuperfaceClient();

  const accessToken = process.env.TWITTER_ACCESSTOKEN;

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/posts-lookup');

    let page = undefined;

    //read up to 3 pages of posts
    for (let i = 0; i < 3; i++) {
      console.log(`Getting page #${i + 1}`);
      const result = await profile.getUseCase('FindByHashtag').perform(
        { hashtag, page },
        {
          provider,
          parameters: {
            accessToken,
          },
        }
      );
      unwrappedResult = result.unwrap();

      console.log(inspect(result.unwrap(), false, Infinity, true));

      if (!unwrappedResult.nextPage) {
        break;
      } else {
        page = unwrappedResult.nextPage;
      }
    }
  } catch (err) {
    console.error(inspect(err, false, Infinity, true));
  }
};

const hashtag = process.argv[2] || 'apis';

findPostsByHashtag(hashtag);
