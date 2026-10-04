export type Link = {
  id: string;
  url: string;
  title: string;
  /** URL de una imagen real. Si no existe, se muestra el placeholder. */
  thumbnail?: string;
  domain: string;
  createdAt: string; // ISO
};

export type Folder = {
  id: string;
  name: string;
  icon: string;
  color: string;
  links: Link[];
};

export type PlatformKey =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'facebook'
  | 'whatsapp'
  | 'x'
  | 'web';

export type PlatformInfo = {
  key: PlatformKey;
  label: string;
  /** Color de acento solo visual para el placeholder de la miniatura. */
  color: string;
  emoji: string;
};

export const MAX_LINKS_PER_FOLDER = 30;
export const MAX_FOLDER_NAME_WORDS = 15;
export const FOLDER_COLORS = [
  '#E4572E',
  '#F3A712',
  '#2A9D8F',
  '#3A86FF',
  '#8338EC',
  '#D1495B',
  '#52606D',
] as const;
