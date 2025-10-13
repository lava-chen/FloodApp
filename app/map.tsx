import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { Platform, View } from 'react-native';

export default function MapScreen() {
  if (Platform.OS === 'web') {
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <ThemedText>地图仅在原生设备上展示。请在 iOS/Android 运行查看。</ThemedText>
      </ThemedView>
    );
  }

  // Dynamically require native-only module to avoid web import.
  const RNMaps = require('react-native-maps');
  const MapView = RNMaps.default as typeof import('react-native-maps').default;
  const UrlTile = RNMaps.UrlTile as typeof import('react-native-maps').UrlTile;
  const PROVIDER_GOOGLE = RNMaps.PROVIDER_GOOGLE as typeof import('react-native-maps').PROVIDER_GOOGLE;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{ latitude: 39.9042, longitude: 116.4074, latitudeDelta: 0.5, longitudeDelta: 0.5 }}>
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          shouldReplaceMapContent={false}
        />
      </MapView>
    </View>
  );
}


