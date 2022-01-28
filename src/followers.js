const { inspect } = require('node:util');
const dotenv = require('dotenv');
const { SuperfaceClient } = require('@superfaceai/one-sdk');

dotenv.config();

const printFollowers = async (profileId) => {
  const sdk = new SuperfaceClient();

  const accessToken = process.env.TWITTER_ACCESSTOKEN;

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/followers');
    const result = await profile.getUseCase('GetFollowers').perform(
      { profileId },
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

printFollowers(profileId);
