import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { POST as previewPost } from '../../app/api/elevenlabs/preview/route';
import { POST as personaplexPost } from '../../app/api/personaplex/session/route';
import { POST as promoPost } from '../../app/api/promo/redeem/route';
import { POST as ttsPost } from '../../app/api/text-to-speech/route';
import { POST as uploadPost } from '../../app/api/video/client-upload/route';
import { isAllowedReaderVoice } from './voices';

const ORIGIN = 'https://www.selftape.ai';

async function read(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();
  return { status: response.status, body };
}

function request(path: string, init: RequestInit) {
  return new Request(`https://www.selftape.ai${path}`, init);
}

describe('Phase 0 auth-first gates', () => {
  const routes = [
    { path: '/api/personaplex/session', post: personaplexPost, body: {} },
    { path: '/api/video/client-upload', post: uploadPost, body: {} },
    { path: '/api/promo/redeem', post: promoPost, body: {} },
  ] as const;

  for (const route of routes) {
    it(`${route.path} without Origin is 403 Origin metadata required`, async () => {
      const result = await read(
        await route.post(
          request(route.path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(route.body),
          }),
        ),
      );
      assert.equal(result.status, 403);
      assert.deepEqual(result.body, { error: 'Origin metadata required' });
    });

    it(`${route.path} with a foreign Origin is 403 Origin not allowed`, async () => {
      const result = await read(
        await route.post(
          request(route.path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' },
            body: JSON.stringify(route.body),
          }),
        ),
      );
      assert.equal(result.status, 403);
      assert.deepEqual(result.body, { error: 'Origin not allowed' });
    });

    it(`${route.path} with Origin and no auth is 401 before body validation`, async () => {
      const result = await read(
        await route.post(
          request(route.path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
            body: JSON.stringify(route.body),
          }),
        ),
      );
      assert.equal(result.status, 401);
      assert.deepEqual(result.body, { error: 'Authentication required' });
    });
  }

  it('personaplex with participants still 401 without a session', async () => {
    const result = await read(
      await personaplexPost(
        request('/api/personaplex/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
          body: JSON.stringify({ participants: [{ characterId: 'a', characterName: 'A' }] }),
        }),
      ),
    );
    assert.equal(result.status, 401);
    assert.deepEqual(result.body, { error: 'Authentication required' });
  });

  it('client-upload with a blob token event still 401 without a session', async () => {
    const result = await read(
      await uploadPost(
        request('/api/video/client-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
          body: JSON.stringify({
            type: 'blob.generate-client-token',
            payload: { pathname: 'recordings/test.webm' },
          }),
        }),
      ),
    );
    assert.equal(result.status, 401);
    assert.deepEqual(result.body, { error: 'Authentication required' });
  });

  it('promo with a code still 401 without a session', async () => {
    const result = await read(
      await promoPost(
        request('/api/promo/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
          body: JSON.stringify({ promoCode: 'TEST' }),
        }),
      ),
    );
    assert.equal(result.status, 401);
    assert.deepEqual(result.body, { error: 'Authentication required' });
  });
});

describe('Reader TTS / preview', () => {
  it('preview exists and requires auth after Origin', async () => {
    const result = await read(
      await previewPost(
        request('/api/elevenlabs/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
          body: JSON.stringify({ voiceId: 'EXAVITQu4vr4xnSDxMaL', text: 'Hello' }),
        }),
      ),
    );
    assert.equal(result.status, 401);
    assert.deepEqual(result.body, { error: 'Authentication required' });
  });

  it('text-to-speech requires auth after Origin', async () => {
    const result = await read(
      await ttsPost(
        request('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
          body: JSON.stringify({ voiceId: 'EXAVITQu4vr4xnSDxMaL', text: 'Hello' }),
        }),
      ),
    );
    assert.equal(result.status, 401);
    assert.deepEqual(result.body, { error: 'Authentication required' });
  });

  it('allows the live studio catalog and rejects unknown ids', () => {
    assert.equal(isAllowedReaderVoice('EXAVITQu4vr4xnSDxMaL'), true);
    assert.equal(isAllowedReaderVoice('21m00Tcm4TlvDq8ikWAM'), true);
    assert.equal(isAllowedReaderVoice('not-a-voice'), false);
  });
});
