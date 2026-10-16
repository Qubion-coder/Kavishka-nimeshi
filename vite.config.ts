import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

// Absolute site URL for link previews (WhatsApp needs absolute og:image URLs).
// Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time; SITE_URL overrides it.
function siteUrl(env: Record<string, string>) {
  const url = env.SITE_URL || process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || '';
  if (!url) return '';
  return (url.startsWith('http') ? url : `https://${url}`).replace(/\/$/, '');
}

// Link previews are read from static HTML, so the homecoming invitation gets its own
// page (/homecoming) carrying the homecoming title, description and image.
function invitationPreviews(site: string): Plugin {
  const wedding = {
    title: "Kavishka & Nimeshi's Wedding Invitation",
    desc: 'our wedding celebration on November 25, 2026.',
    alt: 'Kavishka &amp; Nimeshi Wedding Invitation',
    image: '/og-wedding.jpg',
    url: `${site}/"`,
  };
  const homecoming = {
    title: "Kavishka & Nimeshi's Homecoming Invitation",
    desc: 'our homecoming celebration on November 27, 2026.',
    alt: 'Kavishka &amp; Nimeshi Homecoming Invitation',
    image: '/og-homecoming.jpg',
    url: `${site}/homecoming"`,
  };

  return {
    name: 'invitation-previews',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', site),
    writeBundle(options) {
      const outDir = options.dir ?? 'dist';
      let html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf-8');
      for (const key of Object.keys(wedding) as (keyof typeof wedding)[]) {
        html = html.replaceAll(wedding[key], homecoming[key]);
      }
      fs.writeFileSync(path.join(outDir, 'homecoming.html'), html);
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), invitationPreviews(siteUrl(env))],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
