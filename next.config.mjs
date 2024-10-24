import "./src/constants/env.mjs";

// References
// GLOBAL
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

// Media API
// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
// example: https://whatpwacando.today/media

// Geolocation
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
// example: https://whatpwacando.today/geolocation

// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
// example: https://whatpwacando.today/notifications

// Web Share
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
// example: https://whatpwacando.today/web-share

// TODO: implement the following:
// View Transitions
// https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
// example: https://whatpwacando.today/view-transitions

// only chrome/android/desktop
// https://developer.chrome.com/docs/capabilities/web-apis/file-handling
// https://developer.chrome.com/docs/capabilities/web-apis/file-system-access
// example: https://whatpwacando.today/file-handling/

// Storage API
// https://developer.mozilla.org/en-US/docs/Web/API/Storage_API
// https://storage.spec.whatwg.org/#storagemanager
// example: https://whatpwacando.today/storage

// REF: https://nextjs.org/docs/app/api-reference/next-config-js#phase
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD
} from "next/constants.js";

const CSP_URL = {
  OPEN_STREET_MAP_URL: "*.tile.openstreetmap.org",
  JSON_PLACEHOLDER_URL: "https://jsonplaceholder.typicode.com/posts"
};

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
const customNextConfig = async (phase) => {
  /** @type {import("next").NextConfig} */
  const nextConfig = {
    poweredByHeader: false,
    // REF: https://nextjs.org/docs/app/api-reference/next-config-js/reactStrictMode
    reactStrictMode: true,
    // REF: https://nextjs.org/docs/architecture/nextjs-compiler#minification
    swcMinify: true,
    // REF: https://nextjs.org/docs/app/api-reference/next-config-js/eslint
    eslint: {
      ignoreDuringBuilds: true
    },
    // REF: https://nextjs.org/docs/app/api-reference/next-config-js/typescript
    typescript: {
      ignoreBuildErrors: false
    },
    compiler: {
      // REF: https://nextjs.org/docs/architecture/nextjs-compiler#remove-console
      removeConsole: {
        exclude: ["error"]
      }
    },
    // REF: https://nextjs.org/docs/app/api-reference/next-config-js/httpAgentOptions
    httpAgentOptions: {
      keepAlive: false
    },
    // REF: https://nextjs.org/docs/app/api-reference/next-config-js/devIndicators
    devIndicators: {
      appIsrStatus: true,
      buildActivity: true,
      buildActivityPosition: "top-right"
    },
    experimental: {
      // REF https://nextjs.org/docs/pages/api-reference/next-config-js/optimizePackageImports
      optimizePackageImports: [
        "@hookform/resolvers",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-label",
        "@radix-ui/react-separator",
        "@radix-ui/react-slot",
        "@radix-ui/react-toast",
        "@radix-ui/react-tooltip",
        "@t3-oss/env-nextjs",
        "@tanstack/react-query",
        "embla-carousel-react",
        "leaflet",
        "lucide-react",
        "next",
        "next-themes",
        "react",
        "react-dom",
        "react-hook-form",
        "react-leaflet",
        "react-resizable-panels",
        "zod"
      ]
    },
    // REF: https://nextjs.org/docs/app/api-reference/next-config-js/rewrites
    async rewrites() {
      return [
        {
          source: "/geolocation",
          destination: "/"
        }
      ];
    },
    // REF: https://nextjs.org/docs/app/api-reference/next-config-js/generateBuildId
    generateBuildId: async () => new Date().toISOString(),

    // REF: https://nextjs.org/docs/app/api-reference/next-config-js/headers
    async headers() {
      const sanitizePermissionsPolicy = () => {
        const geolocation = "geolocation=(self)";
        const camera = "camera=(self)";
        const microphone = "microphone=(self)";

        return `${geolocation}, ${camera}, ${microphone}`;
      };

      const sanitizeContentSecurityPolicy = () => {
        const defaultSrc = "default-src 'self'";
        const mediaSrc = "media-src 'self' blob:";
        const scriptSrc = "script-src 'self' 'unsafe-eval' 'unsafe-inline'";
        const styleSrc = "style-src 'self' 'unsafe-inline'";
        const imgSrc = `img-src ${CSP_URL.OPEN_STREET_MAP_URL} 'self' data: blob:`;
        const connectSrc = `connect-src  ${CSP_URL.OPEN_STREET_MAP_URL} ${CSP_URL.JSON_PLACEHOLDER_URL} 'self'`;
        const fontSrc = "font-src 'self' data:";

        return `${defaultSrc}; ${mediaSrc}; ${scriptSrc}; ${styleSrc}; ${imgSrc}; ${connectSrc}; ${fontSrc};`;
      };

      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Permissions-Policy",
              value: sanitizePermissionsPolicy()
            },
            {
              key: "Content-Security-Policy",
              value: sanitizeContentSecurityPolicy()
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff"
            },
            {
              key: "X-Frame-Options",
              value: "DENY"
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin"
            }
          ]
        }
      ];
    }
  };

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import("@serwist/next")).default({
      swSrc: "src/app/sw.ts",
      swDest: "public/sw.js"
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
};

export default customNextConfig;
