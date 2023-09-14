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
    // register user
    invokeRegisterUserInfo: (args: any) =>
      ipcRenderer.invoke('invokeRegisterUserInfo', args),
    onResultRegister: (callback) =>
      ipcRenderer.on('onResultRegister', callback),
    removeAllListenersResultRegister: () =>
      ipcRenderer.removeAllListeners('onResultRegister'),
    // get users
    invokeGetUsers: (args: any) => ipcRenderer.invoke('invokeGetUsers', args),
    onGetUsers: (callback) => ipcRenderer.once('onGetUsers', callback),
    removeAllListenersGetUsers: () =>
      ipcRenderer.removeAllListeners('onGetUsers'),
    // update user info
    invokeUpdateUser: (args: any) =>
      ipcRenderer.invoke('invokeUpdateUser', args),
    onResultUpdateUser: (callback) =>
      ipcRenderer.on('onResultUpdateUser', callback),
    removeAllListenersResultUpdateUser: () =>
      ipcRenderer.removeAllListeners('onResultUpdateUser'),
    // add new user images
    invokeNewUserImages: (args: any) =>
      ipcRenderer.invoke('invokeNewUserImages', args),
    onResultNewUserImages: (callback) =>
      ipcRenderer.on('onResultNewUserImages', callback),
    removeAllListenersResultNewUserImages: () =>
      ipcRenderer.removeAllListeners('onResultNewUserImages'),
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
