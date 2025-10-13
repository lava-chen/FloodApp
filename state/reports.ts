import type { Report } from '@/services/api';
import { enqueue, getQueue, loadQueue, onQueueEvent } from '@/services/offline-queue';
import * as Device from 'expo-device';
import { create } from 'zustand';

type ReportsState = {
  items: Report[];
  init: () => Promise<void>;
  createLocalReport: (payload: Omit<Report, 'status' | 'progress' | 'device'>) => Promise<Report>;
  updateStatus: (id: string, status: Report['status'], progress?: number) => void;
};

export const useReportsStore = create<ReportsState>((set, get) => ({
  items: [],
  init: async () => {
    await loadQueue();
    set({ items: getQueue() });
    onQueueEvent((id, ev) => {
      const next = get().items.map((it) => (it.id === id ? { ...it, status: ev.status, progress: ev.progress } : it));
      set({ items: next });
    });
  },
  createLocalReport: async (payload) => {
    const report: Report = {
      ...payload,
      device: { model: Device.modelName ?? null, os: Device.osVersion ?? null },
      status: 'pending',
    } as Report;
    await enqueue(report);
    set({ items: getQueue() });
    return report;
  },
  updateStatus: (id, status, progress) => {
    set({ items: get().items.map((it) => (it.id === id ? { ...it, status, progress } : it)) });
  },
}));


