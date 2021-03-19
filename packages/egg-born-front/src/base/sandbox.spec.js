export default function() {
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
    for (const _keys of keywords) {
      for (const _key of _keys.split(',')) {
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
  self.onmessage = function(event) {
    const { id, expression, scope } = event.data;
    const scopeKeys = Object.keys(scope);
    const scopeParams = [];
    for (const key of scopeKeys) {
      scopeParams.push(scope[key]);
    }
    const js = `return (${expression})`;
    const fn = new Function(scopeKeys.join(','), js);
    const value = fn.apply(null, scopeParams);
    console.log(value);
    self.postMessage({ id, value });
  };
}
