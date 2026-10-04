import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius } from '../theme';
import { isValidUrl } from '../utils/url';
import { Button } from './Buttons';
import { ModalShell } from './ModalShell';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: { url: string; title: string }) => void;
};

export function AddLinkModal({ visible, onClose, onSubmit }: Props) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (visible) {
      setUrl('');
      setTitle('');
      setTouched(false);
    }
  }, [visible]);

  const valid = isValidUrl(url);

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    onSubmit({ url: url.trim(), title: title.trim() });
  };

  return (
    <ModalShell visible={visible} onClose={onClose}>
      <Text style={styles.title}>Agregar enlace</Text>

      <Text style={styles.label}>URL</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}
        placeholder="https://..."
        placeholderTextColor={colors.textMuted}
        style={[styles.input, touched && !valid && styles.inputError]}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        autoFocus
      />
      {touched && !valid ? <Text style={styles.error}>Ingresa una URL válida.</Text> : null}

      <Text style={[styles.label, styles.labelSpaced]}>Título</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Mi enlace"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        maxLength={80}
        returnKeyType="done"
        onSubmitEditing={submit}
      />

      <View style={styles.actions}>
        <Button label="Cancelar" variant="ghost" onPress={onClose} style={styles.flex} />
        <Button label="Guardar" onPress={submit} style={styles.flex} />
      </View>
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 6 },
  labelSpaced: { marginTop: 16 },
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
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 13, marginTop: 6 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  flex: { flex: 1 },
});
