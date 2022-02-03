const { inspect } = require('node:util');
const dotenv = require('dotenv');
const { SuperfaceClient } = require('@superfaceai/one-sdk');

dotenv.config();

const publishPost = async (message) => {
  const sdk = new SuperfaceClient();

  const accessToken = process.env.TWITTER_ACCESSTOKEN;

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/publish-post');
    const result = await profile.getUseCase('PublishPost').perform(
      {
        text: message,
      },
      {
        provider,
        parameters: {
          accessToken,
        },
      }
    );
    console.log(inspect(result.unwrap(), false, Infinity, true));
  } catch (err) {
    console.error(inspect(err, false, Infinity, true));
  }
};

const message = process.argv[2] || 'Hello from Superface.';

publishPost(message);
