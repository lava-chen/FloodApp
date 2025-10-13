import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { pollResult } from '@/services/api';
import { useReportsStore } from '@/state/reports';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const report = useReportsStore((s) => s.items.find((r) => r.id === id));
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      const res = await pollResult(String(id), { timeoutMs: 20000 });
      if (mounted) setResult(res);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!report) return <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ThemedText>未找到报告</ThemedText></ThemedView>;

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 12 }}>
        <Image source={{ uri: report.localImageUri }} style={{ width: '100%', height: 240, borderRadius: 8 }} />
        <ThemedText>位置: {report.coords ? `${report.coords.latitude.toFixed(5)}, ${report.coords.longitude.toFixed(5)} (±${report.coords.accuracy ?? '-'}m)` : '未知'}</ThemedText>
        <ThemedText>时间: {new Date(report.takenAt).toLocaleString()}</ThemedText>
        {result ? (
          <View style={{ gap: 4 }}>
            <ThemedText type="subtitle">识别结果</ThemedText>
            <ThemedText>标签: {result.label ?? 'N/A'}</ThemedText>
            <ThemedText>置信度: {result.confidence != null ? Math.round(result.confidence * 100) + '%' : 'N/A'}</ThemedText>
            <ThemedText>建议: {result.suggestion ?? '保持安全，远离积水区域'}</ThemedText>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ActivityIndicator />
            <ThemedText>正在识别，请稍候...</ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}


