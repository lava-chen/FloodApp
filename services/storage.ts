import * as FileSystem from 'expo-file-system';

export async function ensureDir(dirUri: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(dirUri);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
  }
}

export async function copyToAppDir(srcUri: string, filename: string): Promise<string> {
  const base = (FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '';
  const dir = base + 'reports/';
  await ensureDir(dir);
  const dest = dir + filename;
  await FileSystem.copyAsync({ from: srcUri, to: dest });
  return dest;
}

export async function removeFile(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    // ignore
  }
}


