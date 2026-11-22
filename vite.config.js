import { readFileSync, renameSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

const SINGLE_DIR = 'dist-single'
const SINGLE_NAME = 'cardio-nurse.html'

// `npm run build:single`: seluruh app (JS, CSS, font, ikon) jadi satu file HTML
// yang bisa dibuka langsung tanpa hosting. Tanpa PWA karena service worker
// tidak bisa jalan dari file://.
function singleFilePlugins() {
  const iconSvg = readFileSync(resolve('public/icon.svg'), 'utf8')
  const iconData = `data:image/svg+xml,${encodeURIComponent(iconSvg)}`
  return [
    viteSingleFile(),
    {
      name: 'cardio-nurse-single-file',
      transformIndexHtml(html) {
        return html
          .replace(/<link rel="icon"[^>]*>/, `<link rel="icon" href="${iconData}" type="image/svg+xml" />`)
          .replace(/\s*<link rel="apple-touch-icon"[^>]*>/, '')
      },
      writeBundle(options) {
        renameSync(resolve(options.dir, 'index.html'), resolve(options.dir, SINGLE_NAME))
      },
    },
  ]
}

// base './' supaya bisa jalan di GitHub Pages (subfolder) maupun domain sendiri
export default defineConfig(({ mode }) => {
  if (mode === 'single') {
    return {
      base: './',
      publicDir: false,
      plugins: [react(), ...singleFilePlugins()],
      build: { outDir: SINGLE_DIR, emptyOutDir: true },
    }
  }

  return {
    base: './',
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
        manifest: {
          name: 'Cardio Nurse',
          short_name: 'Cardio Nurse',
          description: 'Media edukasi perawatan mandiri untuk pasien gagal jantung.',
          lang: 'id',
          start_url: './',
          scope: './',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#1f2a6b',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        },
      }),
    ],
  }
})
