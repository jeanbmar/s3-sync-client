export interface DeferredPromise {
  promise: Promise<any>;
  resolve: Function;
}
