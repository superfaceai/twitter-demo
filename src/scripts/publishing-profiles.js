const { inspect } = require('node:util');
const dotenv = require('dotenv');
const { SuperfaceClient } = require('@superfaceai/one-sdk');

dotenv.config();

const printPublishingProfiles = async () => {
  const sdk = new SuperfaceClient();

  const accessToken = process.env.TWITTER_ACCESSTOKEN;

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/publishing-profiles');
    const result = await profile.getUseCase('GetProfilesForPublishing').perform(
      {},
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

printPublishingProfiles();
