import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { Report, uploadReport } from './api';

type QueueEvent = { status: Report['status']; progress?: number };
type Listener = (id: string, ev: QueueEvent) => void;

const STORAGE_KEY = 'reportQueue:v1';

let listeners: Listener[] = [];
let queue: Report[] = [];
let processing = false;

export async function loadQueue() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  queue = raw ? (JSON.parse(raw) as Report[]) : [];
}

async function persistQueue() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function onQueueEvent(cb: Listener) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((x) => x !== cb);
  };
}

function emit(id: string, ev: QueueEvent) {
  listeners.forEach((cb) => cb(id, ev));
}

export async function enqueue(item: Report) {
  queue.push(item);
  await persistQueue();
  void processQueue();
}

export function getQueue() {
  return queue.slice();
}

async function canUploadNow() {
  try {
    const state = await Network.getNetworkStateAsync();
    return !!state.isConnected;
  } catch {
    return true;
  }
}

export async function processQueue() {
  if (processing) return;
  processing = true;
  try {
    for (const item of queue) {
      if (item.status === 'uploaded') continue;
      const ok = await canUploadNow();
      if (!ok) break;
      emit(item.id, { status: 'uploading', progress: 0 });
      try {
        const res = await uploadReport(item, item.localImageUri, (p) => emit(item.id, { status: 'uploading', progress: p }));
        item.status = 'uploaded';
        item.remote = { ...(item.remote || {}), storagePath: res.storagePath };
        emit(item.id, { status: 'uploaded', progress: 1 });
      } catch (e) {
        item.status = 'failed';
        emit(item.id, { status: 'failed' });
      }
      await persistQueue();
    }
  } finally {
    processing = false;
  }
}

export async function retry(id: string) {
  const item = queue.find((q) => q.id === id);
  if (!item) return;
  item.status = 'pending';
  await persistQueue();
  void processQueue();
}

export async function remove(id: string) {
  queue = queue.filter((q) => q.id !== id);
  await persistQueue();
}


