import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow } from '../theme';
import { Link } from '../types';
import { getPlatform } from '../utils/platform';
import { timeAgo } from '../utils/url';
import { LinkThumbnail } from './LinkThumbnail';

type Props = {
  link: Link;
  onPress: () => void;
  onMenu: () => void;
};

export function LinkCard({ link, onPress, onMenu }: Props) {
  const platform = getPlatform(link.domain);
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onMenu}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinkThumbnail platform={platform} uri={link.thumbnail} />
      <View style={styles.body}>
        <View style={styles.textCol}>
          <Text style={styles.title} numberOfLines={2}>
            {link.title}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.dot, { backgroundColor: platform.color }]} />
            <Text style={styles.platform}>{platform.label}</Text>
            <Text style={styles.sep}>·</Text>
            <Text style={styles.date}>{timeAgo(link.createdAt)}</Text>
          </View>
        </View>
        <Pressable onPress={onMenu} hitSlop={12} style={styles.menuBtn}>
          <Text style={styles.menuText}>⋮</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow,
  },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.95 },
  body: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 8 },
  textCol: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text, lineHeight: 22 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  platform: { fontSize: 13, fontWeight: '600', color: colors.text },
  sep: { color: colors.textMuted },
  date: { fontSize: 13, color: colors.textMuted },
  menuBtn: { paddingHorizontal: 6 },
  menuText: { fontSize: 22, color: colors.textMuted, fontWeight: '700' },
});
