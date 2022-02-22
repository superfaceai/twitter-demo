const { inspect } = require('node:util');
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const { withAccessToken } = require('../utils/tokens-utils');

const printFollowers = async (profileId) => {
  const sdk = new SuperfaceClient();

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/followers');
    const result = await withAccessToken((accessToken) =>
      profile.getUseCase('GetFollowers').perform(
        { profileId },
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

printFollowers(profileId);
