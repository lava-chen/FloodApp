import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export default function Button({ title, onPress, variant = 'primary', style }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const bg = variant === 'primary' ? Colors[scheme].tint : Colors[scheme].background;
  const color = variant === 'primary' ? '#fff' : Colors[scheme].text;
  const borderColor = variant === 'primary' ? Colors[scheme].tint : '#ccc';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 10,
          backgroundColor: pressed ? bg + 'dd' : bg,
          borderWidth: 1,
          borderColor,
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Text style={{ color, fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
}


