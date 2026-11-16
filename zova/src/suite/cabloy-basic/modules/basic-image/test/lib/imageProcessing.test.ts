import assert from 'node:assert/strict';
import { test } from 'node:test';

import { resolveImageProcessing } from '../../src/lib/imageProcessing.ts';

const labels = { title: 'Crop', adjust: 'Adjust', cancel: 'Cancel', apply: 'Apply' };
const studentProcessing = {
  enableCrop: true,
  cropAspectRatio: 1,
  resize: { width: 512, height: 512, fit: 'cover', format: 'jpeg', quality: 90 },
} as const;

test('uses scene processing without form defaults or field overrides', () => {
  assert.deepEqual(resolveImageProcessing(studentProcessing, {}, labels), {
    crop: { labels, aspectRatio: 1, shape: undefined },
    resize: studentProcessing.resize,
  });
});

test('preserves no-crop record policy and its own resize settings', () => {
  const processing = {
    enableCrop: false,
    resize: { width: 1280, height: 1280, fit: 'contain', format: 'jpeg', quality: 90 },
  } as const;
  assert.deepEqual(resolveImageProcessing(processing, {}, labels), {
    crop: undefined,
    resize: processing.resize,
  });
});

test('does not invent processing for scenes without a processing policy', () => {
  assert.deepEqual(resolveImageProcessing(undefined, {}, labels), {
    crop: undefined,
    resize: undefined,
  });
});

test('supports standalone uploader crop opt-out and resize overrides', () => {
  assert.deepEqual(
    resolveImageProcessing(
      studentProcessing,
      {
        crop: false,
        resize: { width: 256, height: 256, quality: undefined },
      },
      labels,
    ),
    {
      crop: undefined,
      resize: { ...studentProcessing.resize, width: 256, height: 256 },
    },
  );
});

test('retains existing standalone uploader crop options and policy fallback', () => {
  const localLabels = { ...labels, title: 'Avatar' };
  assert.deepEqual(
    resolveImageProcessing(
      studentProcessing,
      {
        crop: { labels: localLabels, shape: 'round' },
      },
      labels,
    ),
    {
      crop: { labels: localLabels, aspectRatio: 1, shape: 'round' },
      resize: studentProcessing.resize,
    },
  );
  assert.deepEqual(
    resolveImageProcessing(
      undefined,
      {
        crop: { labels: localLabels, aspectRatio: 2 },
        resize: { width: 320, format: 'webp' },
      },
      labels,
    ),
    {
      crop: { labels: localLabels, aspectRatio: 2, shape: undefined },
      resize: { width: 320, format: 'webp' },
    },
  );
});

test('uses a newly resolved policy without retaining or mutating the prior scene', () => {
  const first = resolveImageProcessing(studentProcessing, {}, labels);
  first.resize!.width = 128;
  const next = resolveImageProcessing({ enableCrop: false, resize: { width: 1280 } }, {}, labels);
  assert.equal(studentProcessing.resize.width, 512);
  assert.deepEqual(next, { crop: undefined, resize: { width: 1280 } });
});
