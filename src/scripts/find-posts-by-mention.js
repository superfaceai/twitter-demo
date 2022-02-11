const { inspect } = require('node:util');
const dotenv = require('dotenv');
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const { getTokens } = require('../tokens-utils');

dotenv.config();

const findPostsByHashtag = async (profileId, page) => {
  const sdk = new SuperfaceClient();

  const { accessToken } = getTokens();

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/posts-lookup');
    const result = await profile.getUseCase('FindByMention').perform(
      { profileId, page },
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

const profileId = process.argv[2] || '1466796521412771840';

findPostsByHashtag(profileId);
