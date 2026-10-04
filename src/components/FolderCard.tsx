import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow } from '../theme';
import { Folder, MAX_LINKS_PER_FOLDER } from '../types';

type Props = {
  folder: Folder;
  onPress: () => void;
  onMenu: () => void;
};

export function FolderCard({ folder, onPress, onMenu }: Props) {
  const count = folder.links.length;
  const full = count >= MAX_LINKS_PER_FOLDER;
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onMenu}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconBubble}>
          <Text style={styles.icon}>{folder.icon}</Text>
        </View>
        <Pressable onPress={onMenu} hitSlop={12} style={styles.menuBtn}>
          <Text style={styles.menuText}>⋮</Text>
        </Pressable>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {folder.name}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.sub}>
          {count} {count === 1 ? 'enlace' : 'enlaces'}
        </Text>
        <View style={[styles.counter, full && styles.counterFull]}>
          <Text style={[styles.counterText, full && styles.counterTextFull]}>
            {count}/{MAX_LINKS_PER_FOLDER}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    ...shadow,
  },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.95 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconBubble: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 24 },
  menuBtn: { paddingHorizontal: 6 },
  menuText: { fontSize: 22, color: colors.textMuted, fontWeight: '700' },
  name: { marginTop: 14, fontSize: 20, fontWeight: '700', color: colors.text },
  bottomRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sub: { color: colors.textMuted, fontSize: 14 },
  counter: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  counterFull: { backgroundColor: colors.dangerSoft },
  counterText: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  counterTextFull: { color: colors.danger },
});
