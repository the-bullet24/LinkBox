import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { radius } from '../theme';
import { PlatformInfo } from '../types';

type Props = {
  platform: PlatformInfo;
  /** Cuando exista una miniatura real, solo hay que pasar su URL aquí. */
  uri?: string;
  height?: number;
};

/**
 * Miniatura del enlace. En v0.1 siempre es un placeholder simulado
 * (sin scraping ni APIs). Si `uri` llega, se muestra la imagen real.
 */
export function LinkThumbnail({ platform, uri, height = 150 }: Props) {
  if (uri) {
    return <Image source={{ uri }} style={[styles.base, { height }]} resizeMode="cover" />;
  }
  return (
    <View style={[styles.base, styles.placeholder, { height, backgroundColor: platform.color }]}>
      <View style={styles.circleBig} />
      <View style={styles.circleSmall} />
      <Text style={styles.emoji}>{platform.emoji}</Text>
      <Text style={styles.caption}>LINK PREVIEW</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    overflow: 'hidden',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBig: {
    position: 'absolute',
    right: -40,
    top: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  circleSmall: {
    position: 'absolute',
    left: -24,
    bottom: -36,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  emoji: { fontSize: 38 },
  caption: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
