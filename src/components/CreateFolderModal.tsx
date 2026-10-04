import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius } from '../theme';
import { Button } from './Buttons';
import { ModalShell } from './ModalShell';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  /** Para reutilizarlo como diálogo de "Renombrar carpeta". */
  title?: string;
  initialValue?: string;
  confirmLabel?: string;
};

export function CreateFolderModal({
  visible,
  onClose,
  onSubmit,
  title = 'Nueva carpeta',
  initialValue = '',
  confirmLabel = 'Crear',
}: Props) {
  const [name, setName] = useState(initialValue);

  useEffect(() => {
    if (visible) setName(initialValue);
  }, [visible, initialValue]);

  const canSubmit = name.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(name.trim());
  };

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Mi carpeta"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoFocus
        maxLength={40}
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <View style={styles.actions}>
        <Button label="Cancelar" variant="ghost" onPress={onClose} style={styles.flex} />
        <Button label={confirmLabel} onPress={submit} disabled={!canSubmit} style={styles.flex} />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  flex: { flex: 1 },
});
