import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddLinkModal } from '../../src/components/AddLinkModal';
import { Button } from '../../src/components/Buttons';
import { ConfirmModal } from '../../src/components/ConfirmModal';
import { LinkCard } from '../../src/components/LinkCard';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useFolders } from '../../src/store/FoldersContext';
import { colors, radius } from '../../src/theme';
import { Link, MAX_LINKS_PER_FOLDER, PlatformKey } from '../../src/types';
import { detectPlatformKey, getPlatform } from '../../src/utils/platform';

const PLATFORM_ORDER: PlatformKey[] = [
  'facebook',
  'instagram',
  'whatsapp',
  'x',
  'tiktok',
  'youtube',
  'web',
];

export default function FolderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getFolder, addLink, deleteLink } = useFolders();
  const folder = getFolder(id);

  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Link | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<PlatformKey>>(() => new Set());

  // Si la carpeta ya no existe (p. ej. se eliminó), volver al inicio.
  useEffect(() => {
    if (!folder) router.replace('/');
  }, [folder, router]);

  if (!folder) return null;

  const count = folder.links.length;
  const groups = PLATFORM_ORDER.map((key) => {
    const links = folder.links.filter((link) => detectPlatformKey(link.domain) === key);
    return { key, links, platform: links.length ? getPlatform(links[0].domain) : null };
  }).filter((group) => group.links.length > 0);
  const full = count >= MAX_LINKS_PER_FOLDER;
  const progress = Math.min(count / MAX_LINKS_PER_FOLDER, 1);

  const showLimitMessage = () =>
    Alert.alert('Límite alcanzado', `Esta carpeta alcanzó el límite de ${MAX_LINKS_PER_FOLDER} enlaces.`);

  const onAddPress = () => {
    if (full) {
      showLimitMessage();
      return;
    }
    setAddOpen(true);
  };

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('No se pudo abrir', 'No encontramos una app o navegador para abrir este enlace.');
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader title={`${folder.icon} ${folder.name}`} onBack={() => router.back()} />

      <View style={styles.counterBlock}>
        <View style={styles.counterRow}>
          <Text style={[styles.counter, full && styles.counterFull]}>
            {count} / {MAX_LINKS_PER_FOLDER}
          </Text>
          {full ? <Text style={styles.fullTag}>Carpeta llena</Text> : null}
        </View>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${progress * 100}%`, backgroundColor: full ? colors.danger : colors.primary },
            ]}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 110 }]}>
        {groups.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔗</Text>
            <Text style={styles.emptyTitle}>Carpeta vacía</Text>
            <Text style={styles.emptyText}>Agrega un enlace o compártelo desde otra app.</Text>
          </View>
        ) : (
          groups.map(({ key, links, platform }) => {
            const collapsed = collapsedGroups.has(key);
            return (
              <View key={key} style={styles.platformGroup}>
                <Pressable
                  onPress={() =>
                    setCollapsedGroups((current) => {
                      const next = new Set(current);
                      if (next.has(key)) next.delete(key);
                      else next.add(key);
                      return next;
                    })
                  }
                  style={styles.groupHeader}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: !collapsed }}
                >
                  <View style={styles.groupTitle}>
                    <View style={[styles.platformDot, { backgroundColor: platform?.color }]} />
                    <Text style={styles.groupLabel}>{platform?.label}</Text>
                    <Text style={styles.groupCount}>{links.length}</Text>
                  </View>
                  <Text style={styles.groupToggle}>{collapsed ? '+' : '−'}</Text>
                </Pressable>
                {!collapsed ? (
                  <View style={styles.groupLinks}>
                    {links.map((link) => (
                      <LinkCard
                        key={link.id}
                        link={link}
                        onPress={() => openLink(link.url)}
                        onMenu={() => setDeleteTarget(link)}
                      />
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Button label="＋  Agregar enlace" onPress={onAddPress} style={styles.bottomBtn} />
      </View>

      <AddLinkModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(input) => {
          const result = addLink(folder.id, input);
          setAddOpen(false);
          if (!result.ok && result.reason === 'limit') showLimitMessage();
        }}
      />

      <ConfirmModal
        visible={!!deleteTarget}
        title="Eliminar enlace"
        message="¿Quieres eliminar este enlace?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteLink(folder.id, deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  counterBlock: { marginTop: 14, marginBottom: 18 },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counter: { fontSize: 15, fontWeight: '800', color: colors.primary },
  counterFull: { color: colors.danger },
  fullTag: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginTop: 8,
    overflow: 'hidden',
  },
  fill: { height: 6, borderRadius: 3 },
  list: { flexGrow: 1, gap: 14 },
  platformGroup: { gap: 10 },
  groupHeader: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 2,
  },
  groupTitle: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  platformDot: { width: 10, height: 10, borderRadius: 5 },
  groupLabel: { fontSize: 15, fontWeight: '800', color: colors.text },
  groupCount: { fontSize: 13, color: colors.textMuted },
  groupToggle: { fontSize: 22, fontWeight: '600', color: colors.textMuted },
  groupLinks: { gap: 12 },
  empty: { alignItems: 'center', marginTop: 50, gap: 6 },
  emptyEmoji: { fontSize: 46 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
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
