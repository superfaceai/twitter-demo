const { inspect } = require('node:util');
const { readFile } = require('node:fs/promises');
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const { withAccessToken } = require('../utils/tokens-utils');

const loadFile = async (filePath) => {
  const buffer = await readFile(filePath);
  return buffer;
};

const publishPost = async (input) => {
  const sdk = new SuperfaceClient();

  try {
    const provider = await sdk.getProvider('twitter');
    const profile = await sdk.getProfile('social-media/publish-post');
    const result = await withAccessToken(
      (accessToken) =>
        profile.getUseCase('PublishPost').perform(input, {
          provider,
          parameters: {
            accessToken,
          },
        }),
      false
    );
    console.log(inspect(result.unwrap(), false, Infinity, true));
  } catch (err) {
    console.error(inspect(err, false, Infinity, true));
  }
};

const run = async () => {
  const text = process.argv[2] || `Hello from Superface. ${Date.now()}`;
  const file = process.argv[3];
  const media = [];
  if (process.argv[3]) {
    const contents = await loadFile(file);
    media.push({ contents });
  }
  await publishPost({ text, media });
};

run();
