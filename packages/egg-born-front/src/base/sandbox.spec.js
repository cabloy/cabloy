export default function () {
  function clear() {
    const keywords = [
      'fetch,importScripts,addEventListener,removeEventListener',
      'caches,close,fonts,indexedDB,location,navigator,performance,webkitRequestFileSystem,webkitRequestFileSystemSync,webkitResolveLocalFileSystemSyncURL,webkitResolveLocalFileSystemURL',
      'BackgroundFetchManager,BackgroundFetchRecord,BackgroundFetchRegistration,BarcodeDetector,BroadcastChannel,Cache,CacheStorage',
      'DedicatedWorkerGlobalScope,File,FileList,FileReader,FileReaderSync,FileSystemDirectoryHandle,FileSystemFileHandle,FileSystemHandle,FileSystemWritableFileStream,FinalizationRegistry',
      'FontFace,Headers,IDBCursor,IDBCursorWithValue,IDBDatabase,IDBFactory,IDBIndex,IDBKeyRange,IDBObjectStore,IDBOpenDBRequest,IDBRequest,IDBTransaction,IDBVersionChangeEvent',
      'ImageBitmap,ImageBitmapRenderingContext,ImageData,MediaCapabilities,MessageChannel,MessagePort,NavigationPreloadManager,NavigatorUAData,NetworkInformation,Notification',
      'PaymentInstruments,Performance,PeriodicSyncManager,PermissionStatus,Permissions,PushManager,PushSubscription,PushSubscriptionOptions',
      'ReadableByteStreamController,ReadableStream,ReadableStreamBYOBReader,ReadableStreamBYOBRequest,ReadableStreamDefaultController,ReadableStreamDefaultReader',
      'Request,Response,Serial,SerialPort,ServiceWorkerRegistration,StorageManager,SyncManager,USB,USBConfiguration,USBDevice,USBEndpoint',
      'UserActivation,WebAssembly,WebSocket,Worker,WorkerGlobalScope,WorkerLocation,WorkerNavigator,WritableStream,WritableStreamDefaultWriter',
      'XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload',
    ];
    for (let i = 0; i < keywords.length; i++) {
      const _keys = keywords[i];
      const _keys2 = _keys.split(',');
      for (let j = 0; j < _keys2.length; j++) {
        const _key = _keys2[j];
        Object.defineProperty(self, _key, {
          get() {
            return null;
          },
        });
      }
    }
  }
  // clear
  clear();
  // onmessage
  self.onmessage = function (event) {
    const { id, expression, scope } = event.data;
    try {
      const scopeKeys = Object.keys(scope);
      const scopeParams = [];
      for (let i = 0; i < scopeKeys.length; i++) {
        const key = scopeKeys[i];
        scopeParams.push(scope[key]);
      }
      const fn = createFunction(scopeKeys, expression);
      const value = fn.apply(null, scopeParams);
      // ok
      self.postMessage({ id, value });
    } catch (err) {
      self.postMessage({ id, err: { message: err.message } });
    }
  };
  // function
  function createFunction(scopeKeys, expression) {
    let fn;
    try {
      const js = `return (${expression})`;
      fn = new Function(scopeKeys.join(','), js);
    } catch (err) {
      fn = new Function(scopeKeys.join(','), expression);
    }
    return fn;
  }
}
