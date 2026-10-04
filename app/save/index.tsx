import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Buttons';
import { CreateFolderModal } from '../../src/components/CreateFolderModal';
import { LinkThumbnail } from '../../src/components/LinkThumbnail';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useFolders } from '../../src/store/FoldersContext';
import { colors, radius, shadow } from '../../src/theme';
import { MAX_LINKS_PER_FOLDER } from '../../src/types';
import { getPlatform } from '../../src/utils/platform';
import { getDomain, normalizeUrl } from '../../src/utils/url';

/**
 * Pantalla "Guardar enlace".
 * Se abre al compartir una URL desde otra app (o con el botón de prueba en Configuración).
 */
export default function SaveLinkScreen() {
  const { url: rawUrl = '', title: sharedTitle = '' } = useLocalSearchParams<{
    url?: string;
    title?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { folders, createFolder, addLink } = useFolders();

  const url = normalizeUrl(rawUrl);
  const domain = getDomain(url);
  const platform = getPlatform(domain);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const save = () => {
    if (!selectedId) return;
    const result = addLink(selectedId, {
      url,
      title: sharedTitle || `Enlace de ${platform.label}`,
    });
    if (!result.ok) {
      if (result.reason === 'limit') {
        Alert.alert(
          'Límite alcanzado',
          `Esta carpeta alcanzó el límite de ${MAX_LINKS_PER_FOLDER} enlaces.`,
        );
      }
      return;
    }
    router.replace(`/folder/${selectedId}`);
  };

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader title="Guardar enlace" onBack={close} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewCard}>
          <LinkThumbnail platform={platform} height={170} />
          <View style={styles.previewBody}>
            <Text style={styles.platform}>{platform.label}</Text>
            <Text style={styles.url} numberOfLines={2}>
              {url}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Guardar en:</Text>

        <View style={styles.folderList}>
          {folders.map((f) => {
            const full = f.links.length >= MAX_LINKS_PER_FOLDER;
            const selected = selectedId === f.id;
            return (
              <Pressable
                key={f.id}
                disabled={full}
                onPress={() => setSelectedId(f.id)}
                style={[styles.folderRow, selected && styles.folderRowSelected, full && styles.folderRowFull]}
              >
                <Text style={styles.folderIcon}>{f.icon}</Text>
                <View style={styles.folderTextCol}>
                  <Text style={styles.folderName} numberOfLines={1}>
                    {f.name}
                  </Text>
                  <Text style={[styles.folderCount, full && { color: colors.danger }]}>
                    {full ? 'Carpeta llena' : `${f.links.length} / ${MAX_LINKS_PER_FOLDER}`}
                  </Text>
                </View>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={() => setCreateOpen(true)} style={styles.newFolder}>
          <Text style={styles.newFolderText}>＋  Nueva carpeta</Text>
        </Pressable>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Button label="GUARDAR" onPress={save} disabled={!selectedId} style={styles.bottomBtn} />
      </View>

      <CreateFolderModal
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(name) => {
          const folder = createFolder(name);
          setSelectedId(folder.id);
          setCreateOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 12 },
  previewCard: { backgroundColor: colors.surface, borderRadius: radius.lg, ...shadow },
  previewBody: { padding: 16, gap: 4 },
  platform: { fontSize: 18, fontWeight: '800', color: colors.text },
  url: { fontSize: 13, color: colors.textMuted },
  sectionLabel: { marginTop: 26, marginBottom: 12, fontSize: 15, fontWeight: '700', color: colors.textMuted },
  folderList: { gap: 10 },
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 14,
  },
  folderRowSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  folderRowFull: { opacity: 0.5 },
  folderIcon: { fontSize: 24 },
  folderTextCol: { flex: 1 },
  folderName: { fontSize: 16, fontWeight: '700', color: colors.text },
  folderCount: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  newFolder: {
    marginTop: 14,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
  },
  newFolderText: { fontSize: 15, fontWeight: '700', color: colors.primary },
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
