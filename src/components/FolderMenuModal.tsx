import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../theme';
import { ModalShell } from './ModalShell';

type Props = {
  visible: boolean;
  folderName: string;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
};

/** Menú sencillo del ⋮ de una carpeta: renombrar o eliminar. */
export function FolderMenuModal({ visible, folderName, onClose, onRename, onDelete }: Props) {
  return (
    <ModalShell visible={visible} onClose={onClose}>
      <Text style={styles.title} numberOfLines={1}>
        {folderName}
      </Text>
      <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]} onPress={onRename}>
        <Text style={styles.rowEmoji}>✏️</Text>
        <Text style={styles.rowText}>Renombrar</Text>
      </Pressable>
      <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]} onPress={onDelete}>
        <Text style={styles.rowEmoji}>🗑️</Text>
        <Text style={[styles.rowText, { color: colors.danger }]}>Eliminar carpeta</Text>
      </Pressable>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  pressed: { backgroundColor: colors.bg },
  rowEmoji: { fontSize: 20 },
  rowText: { fontSize: 16, fontWeight: '600', color: colors.text },
});
