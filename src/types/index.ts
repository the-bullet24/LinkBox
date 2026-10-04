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
  links: Link[];
};

export type PlatformKey =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'facebook'
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
