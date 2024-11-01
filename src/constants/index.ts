export const NAV_ITEMS = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "Posts",
    href: "/posts"
  },
  {
    label: "Notifications",
    href: "/notifications"
  },
  {
    label: "Geolocation",
    href: "/geolocation"
  },
  {
    label: "Streaming",
    href: "/streaming"
  },
  {
    label: "File System",
    href: "/file-system"
  }
] as const;

export const LINKS = {
  GITHUB_URL: "https://github.com/henriquebonfim/template_pwa_nextjs",
  LINKEDIN_URL: "https://linkedin.com/in/henriquebonfim/",
  MZL_URL: "https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API"
};

export const CONFIG = {
  VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY!,
  DEFAULT_ICON: "/android-chrome-512x512.png",
  APP_NAME: "PWA App",
  APP_DEFAULT_TITLE: "My Awesome PWA App",
  APP_TITLE_TEMPLATE: "%s - PWA App",
  APP_DESCRIPTION: "Best PWA app in the world!",
  APP_URL: "https://<YOUR_DOMAIN>.onrender.com/",
  APP_LANG: "en"
} as const;

export const DATABASE = {
  IDB_NAME: "app_database",
  IDB_VERSION: 1,
  IDB_KEY_PATH: "id",
  IDB_EVENT_KEY: "db-changed",
  IDB_STORE_FILES: "files",
  IDB_STORE_OBJECTS: "objects",
  IDB_MAX_RETRIES: 3,
  IDB_RETRY_DELAY: 1000
} as const;
