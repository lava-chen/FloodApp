import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export type PermissionKind = 'camera' | 'mediaLibrary' | 'location' | 'notifications';

export async function requestPermission(kind: PermissionKind): Promise<boolean> {
  switch (kind) {
    case 'camera': {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    }
    case 'mediaLibrary': {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
    case 'location': {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    }
    case 'notifications': {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    }
    default:
      return false;
  }
}

export async function ensurePermissions(kinds: PermissionKind[]): Promise<Record<PermissionKind, boolean>> {
  const results: Partial<Record<PermissionKind, boolean>> = {};
  for (const k of kinds) {
    results[k] = await requestPermission(k);
  }
  return results as Record<PermissionKind, boolean>;
}


