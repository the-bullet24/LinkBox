import { PlatformInfo, PlatformKey } from '../types';

const PLATFORMS: Record<PlatformKey, PlatformInfo> = {
  instagram: { key: 'instagram', label: 'Instagram', color: '#E1306C', emoji: '📸' },
  youtube: { key: 'youtube', label: 'YouTube', color: '#FF3B30', emoji: '▶️' },
  tiktok: { key: 'tiktok', label: 'TikTok', color: '#14B8A6', emoji: '🎵' },
  facebook: { key: 'facebook', label: 'Facebook', color: '#1877F2', emoji: '👍' },
  x: { key: 'x', label: 'X', color: '#111827', emoji: '✖️' },
  web: { key: 'web', label: 'Web', color: '#6C5CE7', emoji: '🔗' },
};

/** Coincide si el dominio es exactamente `base` o un subdominio de `base`. */
function matches(domain: string, base: string): boolean {
  return domain === base || domain.endsWith(`.${base}`);
}

export function detectPlatformKey(domain: string): PlatformKey {
  const d = domain.toLowerCase();
  if (matches(d, 'instagram.com')) return 'instagram';
  if (matches(d, 'youtube.com') || matches(d, 'youtu.be')) return 'youtube';
  if (matches(d, 'tiktok.com')) return 'tiktok';
  if (matches(d, 'facebook.com') || matches(d, 'fb.watch')) return 'facebook';
  if (matches(d, 'x.com') || matches(d, 'twitter.com')) return 'x';
  return 'web';
}

export function getPlatform(domain: string): PlatformInfo {
  return PLATFORMS[detectPlatformKey(domain)];
}
