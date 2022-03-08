const { fetch, Headers, Request } = require('cross-fetch');
const FormData = require('form-data');
const oauthHeader = require('oauth-header');
const { getTokens } = require('../utils/tokens-utils');
const { inspect } = require('util');
const { readFile } = require('fs/promises');
const path = require('path');
require('dotenv/config');

const { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } = process.env;

const BASE_URL = 'https://api.twitter.com';
const UPLOAD_URL = 'https://upload.twitter.com';

async function generateHeader(request) {
  const { token, tokenSecret } = await getTokens();
  const generator = new oauthHeader.Generator(
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    token,
    tokenSecret
  );
  return generator.generateHeaderValue(request.method, request.url);
}

async function uploadMedia(mediaItem) {
  const { contents } = mediaItem;
  const form = new FormData();
  form.append('media', contents);
  const request = new Request(new URL('/1.1/media/upload.json', UPLOAD_URL), {
    method: 'POST',
    body: form,
    headers: form.getHeaders(),
  });
  const authorization = await generateHeader(request);
  request.headers.append('Authorization', authorization);
  const res = await fetch(request);
  const body = await res.json();
  return body.media_id_string;
}

async function publishPost(input) {
  const media = input.media || [];
  const mediaKeys = await Promise.all(media.map(uploadMedia));

  const body = JSON.stringify({
    text: 'Hello World! ' + Date.now(),
    media: mediaKeys.length > 0 ? { media_ids: mediaKeys } : undefined,
  });

  const request = new Request(new URL('/2/tweets', BASE_URL), {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body,
    redirect: 'follow',
  });

  const authorization = await generateHeader(request);
  request.headers.append('Authorization', authorization);

  const res = await fetch(request);
  return res.json();
}

async function run() {
  const buffer = await readFile(
    path.join(__dirname, '..', 'assets', 'cat1.jpg')
  );
  const input = {
    text: 'Hello world! ' + Date.now(),
    media: [
      {
        contents: buffer,
        altText: 'Cat',
      },
    ],
  };

  const result = await publishPost(input);
  console.log(inspect(result));
}

run();
