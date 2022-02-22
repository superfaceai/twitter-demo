const { inspect } = require('node:util');
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const { withAccessToken } = require('../utils/tokens-utils');
const { paginated } = require('../utils/paginated');

const PAGES_LIMIT = 3;

const findPostsByMention = async (profileId, page) => {
  const sdk = new SuperfaceClient();

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/posts-lookup');

    const results = paginated(
      (page) =>
        withAccessToken((accessToken) =>
          profile.getUseCase('FindByMention').perform(
            { profileId, page },
            {
              provider,
              parameters: {
                accessToken,
              },
            }
          )
        ),
      PAGES_LIMIT
    );

    for await (const result of results) {
      console.log(inspect(result, false, Infinity, true));
    }
  } catch (err) {
    console.error(inspect(err, false, Infinity, true));
  }
};

const profileId = process.argv[2] || '1196797704015400960'; // @superfaceai

findPostsByMention(profileId);
