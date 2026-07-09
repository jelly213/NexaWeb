import { createSign } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

/**
 * Mints a short-lived access token from a service-account JSON key.
 *
 * Deliberately dependency-free: pulling in googleapis for two read calls is not worth the
 * install, and this keeps the credential handling visible in one readable place.
 */
export async function getAccessToken(scope) {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyPath) {
    throw new Error(
      'GOOGLE_APPLICATION_CREDENTIALS is not set. Point it at the service-account JSON key. ' +
        'See website/analytics/README.md.',
    );
  }

  let key;
  try {
    key = JSON.parse(await readFile(keyPath, 'utf8'));
  } catch (err) {
    throw new Error(`Could not read service-account key at ${keyPath}: ${err.message}`);
  }

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );

  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  const signature = signer.sign(key.private_key, 'base64url');
  const assertion = `${header}.${claim}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status}): ${JSON.stringify(body)}`);
  }
  return body.access_token;
}
