const { inspect } = require('node:util');
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const { withAccessToken } = require('../utils/tokens-utils');

const printPublishingProfiles = async () => {
  const sdk = new SuperfaceClient();

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/publishing-profiles');
    const result = await withAccessToken((accessToken) =>
      profile.getUseCase('GetProfilesForPublishing').perform(
        {},
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

printPublishingProfiles();
