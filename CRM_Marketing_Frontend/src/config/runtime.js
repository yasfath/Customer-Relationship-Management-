import { Capacitor } from "@capacitor/core";

export const IS_NATIVE_APP = Capacitor.isNativePlatform();

// Force the current mobile build into offline-local mode so APK auth
// never falls back to backend networking on device.
export const DATA_MODE = "offline-local";
export const IS_OFFLINE_LOCAL_MODE = DATA_MODE === "offline-local";
