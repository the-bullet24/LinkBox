import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { Button } from './Buttons';
import { ModalShell } from './ModalShell';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  /** Si es true, el botón de confirmar se muestra en rojo. */
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Eliminar',
  destructive = true,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <ModalShell visible={visible} onClose={onCancel}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <Button label="Cancelar" variant="ghost" onPress={onCancel} style={styles.flex} />
        <Button
          label={confirmLabel}
          variant={destructive ? 'danger' : 'primary'}
          onPress={onConfirm}
          style={styles.flex}
        />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  message: { marginTop: 8, fontSize: 15, lineHeight: 21, color: colors.textMuted },
  actions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  flex: { flex: 1 },
});
