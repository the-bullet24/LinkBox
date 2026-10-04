import { useRouter } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../src/components/Buttons';
import { ConfirmModal } from '../src/components/ConfirmModal';
import { CreateFolderModal } from '../src/components/CreateFolderModal';
import { FolderCard } from '../src/components/FolderCard';
import { FolderMenuModal } from '../src/components/FolderMenuModal';
import { useFolders } from '../src/store/FoldersContext';
import { colors } from '../src/theme';
import { Folder } from '../src/types';
import { extractUrl } from '../src/utils/url';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { folders, createFolder, renameFolder, deleteFolder } = useFolders();
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();

  const [createOpen, setCreateOpen] = useState(false);
  const [menuFolder, setMenuFolder] = useState<Folder | null>(null);
  const [renameTarget, setRenameTarget] = useState<Folder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Folder | null>(null);

  // Llega un enlace desde "Compartir" -> abrir la pantalla "Guardar enlace".
  useEffect(() => {
    if (!hasShareIntent) return;
    const raw = shareIntent.webUrl ?? shareIntent.text ?? '';
    const url = shareIntent.webUrl ?? extractUrl(raw);
    if (url) {
      const title = shareIntent.meta?.title ?? '';
      router.push({ pathname: '/save', params: { url, title } });
    }
    resetShareIntent();
  }, [hasShareIntent, shareIntent, resetShareIntent, router]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <View style={styles.header}>
        <Text style={styles.logo}>LinkBox</Text>
        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push('/settings')} hitSlop={10} style={styles.roundBtn}>
            <Text style={styles.roundBtnText}>⚙️</Text>
          </Pressable>
          <Pressable onPress={() => setCreateOpen(true)} hitSlop={10} style={styles.plusBtn}>
            <Text style={styles.plusText}>＋</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.section}>Mis carpetas</Text>

      <FlatList
        data={folders}
        keyExtractor={(f) => f.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 110 }]}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => (
          <FolderCard
            folder={item}
            onPress={() => router.push(`/folder/${item.id}`)}
            onMenu={() => setMenuFolder(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>Aún no tienes carpetas</Text>
            <Text style={styles.emptyText}>Crea una para empezar a guardar enlaces.</Text>
          </View>
        }
      />

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Button label="＋  Nueva carpeta" onPress={() => setCreateOpen(true)} style={styles.bottomBtn} />
      </View>

      <CreateFolderModal
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(name) => {
          createFolder(name);
          setCreateOpen(false);
        }}
      />

      <FolderMenuModal
        visible={!!menuFolder}
        folderName={menuFolder?.name ?? ''}
        onClose={() => setMenuFolder(null)}
        onRename={() => {
          setRenameTarget(menuFolder);
          setMenuFolder(null);
        }}
        onDelete={() => {
          setDeleteTarget(menuFolder);
          setMenuFolder(null);
        }}
      />

      <CreateFolderModal
        visible={!!renameTarget}
        title="Renombrar carpeta"
        confirmLabel="Guardar"
        initialValue={renameTarget?.name ?? ''}
        onClose={() => setRenameTarget(null)}
        onSubmit={(name) => {
          if (renameTarget) renameFolder(renameTarget.id, name);
          setRenameTarget(null);
        }}
      />

      <ConfirmModal
        visible={!!deleteTarget}
        title="Eliminar carpeta"
        message={`¿Quieres eliminar "${deleteTarget?.name ?? ''}" y sus ${deleteTarget?.links.length ?? 0} enlaces?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteFolder(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 32, fontWeight: '900', color: colors.text, letterSpacing: -0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnText: { fontSize: 18 },
  plusBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: { fontSize: 20, color: '#fff', fontWeight: '700' },
  section: { marginTop: 26, marginBottom: 14, fontSize: 15, fontWeight: '700', color: colors.textMuted },
  list: { flexGrow: 1 },
  empty: { alignItems: 'center', marginTop: 60, gap: 6 },
  emptyEmoji: { fontSize: 46 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  emptyText: { fontSize: 14, color: colors.textMuted },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: 'rgba(246,244,255,0.94)',
  },
  bottomBtn: { minHeight: 54 },
});
