import CameraCapture from '@/components/CameraCapture';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Button from '@/components/ui/Button';
import { getCurrentCoordinates } from '@/services/location';
import { copyToAppDir } from '@/services/storage';
import { useReportsStore } from '@/state/reports';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

export default function CaptureScreen() {
  const router = useRouter();
  const createLocalReport = useReportsStore((s) => s.createLocalReport);

  const onPicked = useCallback(async (uri: string) => {
    const id = uuidv4();
    const filename = `${id}.jpg`;
    const savedUri = await copyToAppDir(uri, filename);
    const coords = await getCurrentCoordinates();
    const takenAt = Date.now();
    const report = await createLocalReport({ id, localImageUri: savedUri, coords, takenAt, notes: null, remote: {} } as any);
    router.push({ pathname: '/result', params: { id: report.id } });
  }, [createLocalReport, router]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 16 }}>
        <ThemedText type="title">城市洪涝上报</ThemedText>
        <ThemedText type="subtitle">拍照或选择已有图片</ThemedText>
        <CameraCapture onPicked={onPicked} />
        <Button title="查看历史" onPress={() => router.push('/history')} />
      </View>
    </ThemedView>
  );
}


