// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    registerUserInfo: (args: any) =>
      ipcRenderer.invoke('register-user-info', args),
    onResultRegister: (callback) => ipcRenderer.on('result-register', callback),
    invokeGetUsers: (args: any) => ipcRenderer.invoke('invoke-get-users', args),
    onGetUsers: (callback) => ipcRenderer.once('get-users', callback),
    removeAllListenersGetUsers: () =>
      ipcRenderer.removeAllListeners('get-users'),
    invokeUpdateUser: (args: any) => ipcRenderer.invoke('update-user', args),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
