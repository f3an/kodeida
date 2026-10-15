/* Міст до головного процесу Electron (electron/preload.cjs). У браузері (npm run dev) його немає. */
import { useEffect, useState } from 'react';

export type UpdateStage = 'idle' | 'checking' | 'not-available' | 'available' | 'downloading' | 'downloaded' | 'error';
export interface UpdateState { stage: UpdateStage; version: string | null; error: string | null; percent: number; auto: boolean; supported: boolean }

interface Bridge {
  version: string;
  platform: string;
  updates: {
    get(): Promise<UpdateState>;
    check(): Promise<UpdateState>;
    download(): Promise<void>;
    install(): Promise<void>;
    setAuto(on: boolean): Promise<UpdateState>;
    onState(cb: (s: UpdateState) => void): () => void;
  };
}

export const bridge: Bridge | undefined = (window as unknown as { kodeida?: Bridge }).kodeida;
export const APP_VERSION = bridge?.version || __APP_VERSION__;

export function useUpdates() {
  const [state, setState] = useState<UpdateState | null>(null);
  useEffect(() => {
    if (!bridge) return;
    bridge.updates.get().then(setState);
    return bridge.updates.onState(setState);
  }, []);
  return state;
}
