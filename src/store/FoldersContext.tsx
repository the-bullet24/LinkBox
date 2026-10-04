import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createMockFolders } from '../data/mockData';
import { Folder, Link, MAX_LINKS_PER_FOLDER } from '../types';
import { getDomain, normalizeUrl } from '../utils/url';

type AddLinkResult = { ok: true } | { ok: false; reason: 'limit' | 'not-found' };

type FoldersContextValue = {
  folders: Folder[];
  getFolder: (id: string) => Folder | undefined;
  createFolder: (name: string) => Folder;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  addLink: (folderId: string, input: { url: string; title?: string }) => AddLinkResult;
  deleteLink: (folderId: string, linkId: string) => void;
};

const FoldersContext = createContext<FoldersContextValue | null>(null);

let idCounter = 0;
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

/**
 * Estado en memoria (sin persistencia a propósito en v0.1).
 * Al cerrar la app los datos vuelven a los de demostración.
 */
export function FoldersProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>(() => createMockFolders());

  const getFolder = useCallback((id: string) => folders.find((f) => f.id === id), [folders]);

  const createFolder = useCallback((name: string): Folder => {
    const folder: Folder = { id: newId('folder'), name: name.trim(), icon: '📁', links: [] };
    setFolders((prev) => [...prev, folder]);
    return folder;
  }, []);

  const renameFolder = useCallback((id: string, name: string) => {
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name: name.trim() } : f)));
  }, []);

  const deleteFolder = useCallback((id: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const addLink = useCallback(
    (folderId: string, input: { url: string; title?: string }): AddLinkResult => {
      const folder = folders.find((f) => f.id === folderId);
      if (!folder) return { ok: false, reason: 'not-found' };
      if (folder.links.length >= MAX_LINKS_PER_FOLDER) return { ok: false, reason: 'limit' };

      const url = normalizeUrl(input.url);
      const domain = getDomain(url);
      const link: Link = {
        id: newId('link'),
        url,
        title: input.title?.trim() || domain || url,
        domain,
        createdAt: new Date().toISOString(),
      };
      setFolders((prev) =>
        prev.map((f) => (f.id === folderId ? { ...f, links: [link, ...f.links] } : f)),
      );
      return { ok: true };
    },
    [folders],
  );

  const deleteLink = useCallback((folderId: string, linkId: string) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folderId ? { ...f, links: f.links.filter((l) => l.id !== linkId) } : f,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ folders, getFolder, createFolder, renameFolder, deleteFolder, addLink, deleteLink }),
    [folders, getFolder, createFolder, renameFolder, deleteFolder, addLink, deleteLink],
  );

  return <FoldersContext.Provider value={value}>{children}</FoldersContext.Provider>;
}

export function useFolders(): FoldersContextValue {
  const ctx = useContext(FoldersContext);
  if (!ctx) throw new Error('useFolders debe usarse dentro de <FoldersProvider>');
  return ctx;
}
