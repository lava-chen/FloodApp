import React from 'react';
import { Text, View } from 'react-native';

type Props = { status: string; progress?: number };

export default function UploadProgress({ status, progress }: Props) {
  return (
    <View style={{ padding: 8 }}>
      <Text>状态: {status}</Text>
      {typeof progress === 'number' ? <Text>进度: {Math.round(progress * 100)}%</Text> : null}
    </View>
  );
}


