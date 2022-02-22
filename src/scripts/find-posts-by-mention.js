const { inspect } = require('node:util');
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const { withAccessToken } = require('../tokens-utils');

const findPostsByMention = async (profileId, page) => {
  const sdk = new SuperfaceClient();

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/posts-lookup');

    const result = await withAccessToken((accessToken) =>
      profile.getUseCase('FindByMention').perform(
        { profileId, page },
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

const profileId = process.argv[2] || '1196797704015400960'; // @superfaceai

findPostsByMention(profileId);
