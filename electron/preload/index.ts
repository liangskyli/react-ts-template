import { contextBridge } from 'electron';

const apiKey = 'electronAPI';

const api = {
  versions: process.versions,
};

contextBridge.exposeInMainWorld(apiKey, api);
