// This import enable module augmentation instead of module overwrite
import 'quasar';

declare module 'quasar' {
  // This will be merged with other definitions
  //  thanks to interface declaration merging
  export interface QuasarFeatureFlags {
    ssr: true; // The object key is the feature flag name
  }
}
