import { describe, it, expect } from 'vitest';
import {
  getMimeType,
  getExtension,
  formatFileSize,
  SUPPORTED_FORMATS,
  SUPPORTED_INPUT_TYPES,
} from '../utils/converter';

describe('getMimeType', () => {
  it('returns correct MIME type for png', () => {
    expect(getMimeType('png')).toBe('image/png');
  });

  it('returns correct MIME type for jpg', () => {
    expect(getMimeType('jpg')).toBe('image/jpeg');
  });

  it('returns correct MIME type for jpeg', () => {
    expect(getMimeType('jpeg')).toBe('image/jpeg');
  });

  it('returns correct MIME type for webp', () => {
    expect(getMimeType('webp')).toBe('image/webp');
  });

  it('returns correct MIME type for bmp', () => {
    expect(getMimeType('bmp')).toBe('image/bmp');
  });

  it('returns correct MIME type for gif', () => {
    expect(getMimeType('gif')).toBe('image/gif');
  });

  it('returns image/png for unknown format', () => {
    expect(getMimeType('unknown')).toBe('image/png');
  });

  it('is case-insensitive', () => {
    expect(getMimeType('PNG')).toBe('image/png');
    expect(getMimeType('JPG')).toBe('image/jpeg');
  });
});

describe('getExtension', () => {
  it('returns correct extension for png', () => {
    expect(getExtension('png')).toBe('png');
  });

  it('returns jpg for both jpg and jpeg', () => {
    expect(getExtension('jpg')).toBe('jpg');
    expect(getExtension('jpeg')).toBe('jpg');
  });

  it('returns correct extension for webp', () => {
    expect(getExtension('webp')).toBe('webp');
  });

  it('returns correct extension for bmp', () => {
    expect(getExtension('bmp')).toBe('bmp');
  });

  it('returns correct extension for gif', () => {
    expect(getExtension('gif')).toBe('gif');
  });

  it('is case-insensitive', () => {
    expect(getExtension('PNG')).toBe('png');
  });
});

describe('formatFileSize', () => {
  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('formats KB', () => {
    expect(formatFileSize(2048)).toBe('2.0 KB');
  });

  it('formats MB', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('formats GB', () => {
    expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5 GB');
  });
});

describe('SUPPORTED_FORMATS', () => {
  it('contains all 5 output formats', () => {
    const values = SUPPORTED_FORMATS.map((f) => f.value);
    expect(values).toContain('png');
    expect(values).toContain('jpg');
    expect(values).toContain('webp');
    expect(values).toContain('bmp');
    expect(values).toContain('gif');
  });

  it('each format has a value and label', () => {
    SUPPORTED_FORMATS.forEach((f) => {
      expect(f).toHaveProperty('value');
      expect(f).toHaveProperty('label');
      expect(typeof f.value).toBe('string');
      expect(typeof f.label).toBe('string');
      expect(f.label.length).toBeGreaterThan(0);
    });
  });
});

describe('SUPPORTED_INPUT_TYPES', () => {
  it('includes common image MIME types', () => {
    expect(SUPPORTED_INPUT_TYPES).toContain('image/png');
    expect(SUPPORTED_INPUT_TYPES).toContain('image/jpeg');
    expect(SUPPORTED_INPUT_TYPES).toContain('image/webp');
    expect(SUPPORTED_INPUT_TYPES).toContain('image/gif');
    expect(SUPPORTED_INPUT_TYPES).toContain('image/svg+xml');
  });
});
