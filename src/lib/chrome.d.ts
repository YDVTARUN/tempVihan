
// This file provides TypeScript type definitions for Chrome API
/// <reference types="chrome"/>

// Optional: Add any custom type extensions for Chrome APIs if needed
declare namespace chrome {
  namespace storage {
    interface LocalStorageArea {
      get(keys?: string | string[] | { [key: string]: any } | null, callback?: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
    }
  }
}
