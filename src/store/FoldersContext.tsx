import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { FOLDER_COLORS, Folder, Link, MAX_LINKS_PER_FOLDER, MAX_FOLDER_NAME_WORDS } from '../types';
import { getDomain, normalizeUrl } from '../utils/url';

const STORAGE_KEY = 'linkbox.folders.v1';

type AddLinkResult = { ok: true } | { ok: false; reason: 'limit' | 'not-found' };

type FoldersContextValue = {
  folders: Folder[];
  getFolder: (id: string) => Folder | undefined;
  createFolder: (name: string, color: string) => Folder;
  renameFolder: (id: string, name: string, color: string) => void;
  deleteFolder: (id: string) => void;
  addLink: (folderId: string, input: { url: string; title?: string }) => AddLinkResult;
  deleteLink: (folderId: string, linkId: string) => void;
};

const FoldersContext = createContext<FoldersContextValue | null>(null);

let idCounter = 0;
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

export function FoldersProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const writeQueue = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        const savedFolders = stored ? (JSON.parse(stored) as Folder[]) : [];
        setFolders(
          savedFolders.map((folder, index) => ({
            ...folder,
            color: folder.color || FOLDER_COLORS[index % FOLDER_COLORS.length],
            links: Array.isArray(folder.links) ? folder.links.slice(0, MAX_LINKS_PER_FOLDER) : [],
          })),
        );
      })
      .catch(() => {
        if (active) setFolders([]);
      })
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(folders)))
      .catch(() => undefined);
  }, [folders, hydrated]);

  const getFolder = useCallback((id: string) => folders.find((f) => f.id === id), [folders]);

  const createFolder = useCallback((name: string, color: string): Folder => {
    const safeName = name.trim().split(/\s+/).slice(0, MAX_FOLDER_NAME_WORDS).join(' ');
    const folder: Folder = {
      id: newId('folder'),
      name: safeName,
      icon: '📁',
      color: FOLDER_COLORS.includes(color as (typeof FOLDER_COLORS)[number]) ? color : FOLDER_COLORS[0],
      links: [],
    };
    setFolders((prev) => [...prev, folder]);
    return folder;
  }, []);

  const renameFolder = useCallback((id: string, name: string, color: string) => {
    const safeName = name.trim().split(/\s+/).slice(0, MAX_FOLDER_NAME_WORDS).join(' ');
    const safeColor = FOLDER_COLORS.includes(color as (typeof FOLDER_COLORS)[number]) ? color : FOLDER_COLORS[0];
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name: safeName, color: safeColor } : f)));
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

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <FoldersContext.Provider value={value}>{children}</FoldersContext.Provider>;
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg } });

export function useFolders(): FoldersContextValue {
  const ctx = useContext(FoldersContext);
  if (!ctx) throw new Error('useFolders debe usarse dentro de <FoldersProvider>');
  return ctx;
}
