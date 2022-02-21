const { inspect } = require('node:util');
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const { withAccessToken } = require('../utils/tokens-utils');

const publishPost = async (message) => {
  const sdk = new SuperfaceClient();

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/publish-post');
    const result = await withAccessToken((accessToken) =>
      profile.getUseCase('PublishPost').perform(
        {
          text: message,
        },
        {
          provider,
          parameters: {
            accessToken,
          },
        }
      )
    );
    console.log(inspect(result.unwrap(), false, Infinity, true));
  } catch (err) {
    console.error(inspect(err, false, Infinity, true));
  }
};

const message = process.argv[2] || 'Hello from Superface.';

publishPost(message);
