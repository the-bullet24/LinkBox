import { FOLDER_COLORS, Folder, Link } from '../types';
import { getDomain } from '../utils/url';

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

function link(id: string, title: string, url: string, ms: number): Link {
  return { id, title, url, domain: getDomain(url), createdAt: ago(ms) };
}

/** Datos de demostración. Viven solo en memoria. */
export function createMockFolders(): Folder[] {
  return [
    {
      id: 'ideas',
      name: 'Ideas',
      icon: '📁',
      color: FOLDER_COLORS[0],
      links: [
        link('i1', 'Cómo crear mejores Reels', 'https://www.instagram.com/reel/demo1/', 2 * HOUR),
        link('i2', 'Idea para contenido', 'https://www.tiktok.com/@demo/video/123', 1 * DAY),
        link('i3', 'Tutorial de edición', 'https://www.youtube.com/watch?v=demo3', 3 * DAY),
      ],
    },
    {
      id: 'musica',
      name: 'Música',
      icon: '📁',
      color: FOLDER_COLORS[1],
      links: [
        link('m1', 'Nueva canción', 'https://youtu.be/demoSong', 5 * HOUR),
        link('m2', 'Playlist interesante', 'https://www.instagram.com/p/demo2/', 2 * DAY),
      ],
    },
    {
      id: 'trabajo',
      name: 'Trabajo',
      icon: '📁',
      color: FOLDER_COLORS[2],
      links: [
        link('t1', 'Tutorial Java', 'https://www.youtube.com/watch?v=demoJava', 8 * DAY),
      ],
    },
  ];
}
