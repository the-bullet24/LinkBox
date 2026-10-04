import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../src/components/Buttons';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { colors, radius, shadow } from '../../src/theme';
import { MAX_LINKS_PER_FOLDER } from '../../src/types';

const VERSION = '0.1.0';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader title="Configuración" onBack={() => router.back()} />

      <View style={styles.card}>
        <Text style={styles.appName}>LinkBox</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Versión</Text>
          <Text style={styles.value}>{VERSION}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Límite por carpeta</Text>
          <Text style={styles.value}>{MAX_LINKS_PER_FOLDER} enlaces</Text>
        </View>
      </View>

      {/* Solo para probar el flujo mientras no se pueda compartir desde otra app (p. ej. en Expo Go). */}
      <View style={styles.testBlock}>
        <Text style={styles.testTitle}>Prueba del flujo Compartir</Text>
        <Text style={styles.testText}>
          Simula que recibes un enlace de Instagram desde el menú Compartir de Android.
        </Text>
        <Button
          label="Simular enlace compartido"
          variant="ghost"
          onPress={() =>
            router.push({
              pathname: '/save',
              params: { url: 'https://www.instagram.com/reel/ejemplo123/', title: '' },
            })
          }
          style={styles.testBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  card: {
    marginTop: 18,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    ...shadow,
  },
  appName: { fontSize: 24, fontWeight: '900', color: colors.text, marginBottom: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  label: { fontSize: 15, color: colors.textMuted, fontWeight: '600' },
  value: { fontSize: 15, color: colors.text, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border },
  testBlock: { marginTop: 28, gap: 8 },
  testTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  testText: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  testBtn: { marginTop: 6 },
});
