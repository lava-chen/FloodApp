import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

export type Report = {
  id: string;
  localImageUri: string;
  coords?: { latitude: number; longitude: number; accuracy?: number | null } | null;
  takenAt: number;
  device: { model?: string | null; os?: string | null };
  notes?: string | null;
  status: 'pending' | 'uploading' | 'uploaded' | 'failed';
  progress?: number;
  remote?: { storagePath?: string; resultId?: string };
};

let supabase: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  if (supabase) return supabase;
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Supabase env missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }
  supabase = createClient(url, key);
  return supabase;
}

export async function uploadReport(
  item: Report,
  fileUri: string,
  onProgress?: (p: number) => void
): Promise<{ storagePath: string; reportId: string }> {
  const path = `reports/${item.id}.jpg`;

  // Supabase RN upload needs fetch blob workaround; expo-file-system provides URI fetch.
  // Here we use supabase-js upload convenience which accepts file-like objects in native.
  const client = getSupabase();
  const res = await client.storage.from('reports').upload(path, {
    // @ts-ignore: expo uploads via file URI
    uri: fileUri,
    name: `${item.id}.jpg`,
    type: 'image/jpeg',
  }, { upsert: true });

  if (res.error) throw res.error;

  const { data } = await client.from('reports').insert({
    id: item.id,
    storage_path: path,
    latitude: item.coords?.latitude ?? null,
    longitude: item.coords?.longitude ?? null,
    accuracy: item.coords?.accuracy ?? null,
    taken_at: new Date(item.takenAt).toISOString(),
    device_os: item.device.os ?? Platform.OS,
    notes: item.notes ?? null,
  }).select('id').single();

  if (!data) throw new Error('failed to insert report row');

  // Simplified: return immediately; result polling handled separately
  onProgress && onProgress(1);
  return { storagePath: path, reportId: data.id };
}

export async function pollResult(reportId: string, { timeoutMs = 15000, intervalMs = 1500 } = {}) {
  const start = Date.now();
  const client = getSupabase();
  while (Date.now() - start < timeoutMs) {
    const { data, error } = await client
      .from('results')
      .select('*')
      .eq('report_id', reportId)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return null;
}


