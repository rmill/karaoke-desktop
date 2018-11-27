const electron = require('electron');
const { app } = electron;
const { BrowserWindow } = electron;
const { ipcMain } = require('electron');
const admin = require('firebase-admin');

// Create  constant for the app path
const APP_PATH = `file://${__dirname}`;
const PROD = 'prod';
let win;

// Create connection to firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "rat-king-karaoke",
    clientEmail: "firebase-adminsdk-a7bjd@rat-king-karaoke.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4lD4PKEtQMp8r\nve1hrwnxe+E2np5mXxplpkN6itfPol0dIf7qX5uSTKiKaVcAC0OT4TDZEpJN/oJn\nc7NgKdWZgKdxHkMwARtBCddX+doYtLVJReOjgcfKJDZMWzizlulpTeMUc9yFWACR\n7wSBeKSkTm9Oh+4LfrumE1EUgJ7Wyb67e0QQyy0CxjP3VYqGvq7fYfWdX9BdT0Cb\nJ5bUZd2dTTxZApG7DiImK8zi3BL0Ys+Re9jZ4HCma6IE+sOgSnoUGXF4DV+CcRK4\nxQUohOCePRcAamiz0S7tl5YfUtNxbDlLtaNZpq/Z9BXH1kIskQBKRzCv2p8jOQ0h\nXYKSPzbFAgMBAAECggEAAQIeTKrlrmx4Xh7NeykfnsgUdN3s85Y1aLS9zZ+QijvS\n0mPrJpCbIvN0QD1PElr9ZYNnZugpEHABelsxcacI2avQPlfx+gMniPVqzbo5rMTf\n8KSHF8+PrdUAzu34o1KBt+eLBAOWAsx2RFXP6n0kORmMlhs7+6gXklKssLX7KCUz\nmvxUDDA9Bt5WfB64VQGhs0nUaEoNQlv0KVSGjr95fy1bGaYThKBHkcpCPkuSuX54\n/S2Ut5e+95ERaGBuo9nNF3VWDe2R7bAmKVU+99GUnkI+4yXoelBy8d6zFhgMKlpH\nNNZOWfU+OU1E797wy6f+5IpGHK4iQ8Rp+DaHVhSNgQKBgQDi+CVs+ewEFS+VtXhs\nVlgtCemqb8SBEC+tZfphT4uzNpoGz9kFZm2zot3uehZ45LCDzgwJl9VN4o+Ly1mk\nuzQ6BVB72agZIKElSyy1hIpUzyzHw74swsDgEgqVnW3xW+YeLQwHousCkICqRVYf\nA+td7cweZLnC3Kqyr75BoeZQtQKBgQDQMBNQSLkbQ9pMaQv9fafKHVB3baLIklWM\nkaVsYoFR+tPnlp9q7zq/+4+h8jL+1xBXdF6491f26+EcV8cCFtPJ4iTWrmVgp9XB\ndpmGp+B9n0AdnVr7bNNXNefZU1Fj8XPUPnmQFWoG/3HRqqH8HhHvNQgxEy0OZvbx\nl+FdG1Tn0QKBgQDQIgIf9ucpr0vdm3X80wk08/wk4S1vtSojdnquNcXD5/RC/uLi\ngtVif53IjIiDACOmGpMLUQK302UTKrzfxRPViP4PNL9jm3pquo8bPZmkv/8uiR+h\n6E36rFCsdptVU5KoZWK8tfeQeHakrcSV2IBDuEcQMAnw2W5nQaXUheSwaQKBgQCV\nUXX4xkAlwxPmbA2SgbZ/q2jUT8lKbFJ5oNjyFPDF+M5Vs12h1/XeTrKlJ87VozDw\nWOG7boQj8OijaH2vDOpYSR+87pZ9rcMNoF/bCbtkvnzBAOSJonMugNZKtIySz1IR\nb8HGyuUiIcLj66uE5ZhdZj7629McGlOR0ipsmjbakQKBgE3lD6TJLMZUBdjXrK5Y\nLbMhHOMSQJlTuMGz72qjSRo7wWARBPD+P6/0bYX06FItYUL4mbL44aC9QFziQ80b\nPe6Tn5lf/zOKyORSnETmrhIlAs4T9OEOubZn3b2c4CftEgYuGYYToljHBBeQMdAo\ndOC1Q8zFfp4ZzdcSv4R6pd2R\n-----END PRIVATE KEY-----\n",
    }),
  databaseURL: "https://rat-king-karaoke.firebaseio.com",
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow();
  win.setFullScreen(true);

  if (process.env.NODE_ENV === PROD) {
    win.setMenu(null);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  ipcMain.on('push-notification', (e, data) => {
    admin.messaging()[data.action](...data.params)
  });

  ipcMain.on('database', (e, trans) => {
    let ref = admin.database().ref(trans.resource);

    if (trans.action == 'bind') {
      let responseKey = `${trans.resource}/${trans.data.event}`;
      ref.on(trans.data.event, res => {
        const val = res.val()

        if (!val) return

        let message = Object.assign(val, { id: res.key })
        e.sender.send(responseKey, message)
      })
    } else {
      ref[trans.action](trans.data)
    }
  });

  win.loadURL(`${APP_PATH}/dist/karaoke-desktop/index.html`);
}
