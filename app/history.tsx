import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useReportsStore } from '@/state/reports';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';

export default function HistoryScreen() {
  const router = useRouter();
  const items = useReportsStore((s) => s.items);
  if (!items.length) {
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText>暂无历史记录</ThemedText>
      </ThemedView>
    );
  }
  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ padding: 12 }}
        data={items}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({ pathname: '/result', params: { id: item.id } })} style={{ flexDirection: 'row', gap: 12, padding: 12, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ddd' }}>
            <Image source={{ uri: item.localImageUri }} style={{ width: 64, height: 64, borderRadius: 6 }} />
            <View style={{ flex: 1 }}>
              <ThemedText numberOfLines={1}>{new Date(item.takenAt).toLocaleString()}</ThemedText>
              <ThemedText numberOfLines={1} style={{ opacity: 0.7 }}>{item.coords ? `${item.coords.latitude.toFixed(4)}, ${item.coords.longitude.toFixed(4)}` : '未知位置'}</ThemedText>
              <ThemedText style={{ opacity: 0.8 }}>{item.status}</ThemedText>
            </View>
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}


