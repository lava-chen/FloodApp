import { ensurePermissions } from '@/services/permissions';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import { Button, Image, Text, View } from 'react-native';

type Props = {
  onPicked: (uri: string) => void;
};

export default function CameraCapture({ onPicked }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const pickFromCamera = useCallback(async () => {
    const ok = await ensurePermissions(['camera'] as any);
    if (!ok) return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setPreview(uri);
      onPicked(uri);
    }
  }, [onPicked]);

  const pickFromLibrary = useCallback(async () => {
    const ok = await ensurePermissions(['mediaLibrary'] as any);
    if (!ok) return;
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setPreview(uri);
      onPicked(uri);
    }
  }, [onPicked]);

  return (
    <View style={{ gap: 12 }}>
      <Text>拍照或选择图片用于洪涝识别</Text>
      {preview ? <Image source={{ uri: preview }} style={{ width: '100%', height: 240, borderRadius: 8 }} /> : null}
      <Button title="拍照" onPress={pickFromCamera} />
      <Button title="从相册选择" onPress={pickFromLibrary} />
    </View>
  );
}


