import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius } from '../theme';
import { FOLDER_COLORS, MAX_FOLDER_NAME_WORDS } from '../types';
import { Button } from './Buttons';
import { ModalShell } from './ModalShell';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string) => void;
  /** Para reutilizarlo como diálogo de "Renombrar carpeta". */
  title?: string;
  initialValue?: string;
  initialColor?: string;
  confirmLabel?: string;
};

export function CreateFolderModal({
  visible,
  onClose,
  onSubmit,
  title = 'Nueva carpeta',
  initialValue = '',
  initialColor = FOLDER_COLORS[0],
  confirmLabel = 'Crear',
}: Props) {
  const [name, setName] = useState(initialValue);
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    if (visible) {
      setName(initialValue);
      setColor(initialColor);
    }
  }, [visible, initialValue, initialColor]);

  const wordCount = name.trim() ? name.trim().split(/\s+/).length : 0;
  const canSubmit = wordCount > 0 && wordCount <= MAX_FOLDER_NAME_WORDS;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(name.trim(), color);
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
        maxLength={120}
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <Text style={styles.wordCount}>{wordCount}/{MAX_FOLDER_NAME_WORDS} palabras</Text>
      {wordCount > MAX_FOLDER_NAME_WORDS ? (
        <Text style={styles.error}>El nombre no puede superar 15 palabras.</Text>
      ) : null}
      <Text style={styles.label}>Color</Text>
      <View style={styles.colors}>
        {FOLDER_COLORS.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="radio"
            accessibilityState={{ selected: color === option }}
            accessibilityLabel={`Color ${option}`}
            onPress={() => setColor(option)}
            style={[styles.colorOption, { backgroundColor: option }, color === option && styles.colorSelected]}
          />
        ))}
      </View>
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
  wordCount: { color: colors.textMuted, fontSize: 12, textAlign: 'right', marginTop: 5, marginBottom: 16 },
  error: { color: colors.danger, fontSize: 12, marginTop: -10, marginBottom: 12 },
  colors: { flexDirection: 'row', gap: 12, marginTop: 4 },
  colorOption: { width: 32, height: 32, borderRadius: 16, borderWidth: 3, borderColor: colors.surface },
  colorSelected: { borderColor: colors.text, transform: [{ scale: 1.12 }] },
  flex: { flex: 1 },
});
