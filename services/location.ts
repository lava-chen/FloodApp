import * as Location from 'expo-location';

export type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};

export async function getCurrentCoordinates(): Promise<Coordinates | null> {
  const perm = await Location.getForegroundPermissionsAsync();
  if (perm.status !== 'granted') return null;
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy ?? null,
  };
}


