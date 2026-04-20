// vite.js — shared Vite configuration utilities
// Usage:
//   import { createAppConfig, createManualChunks, defaultVendorChunks } from '@somenergia/frontend-config/vite'
//   export default createAppConfig(({ mode }) => ({
//     plugins: [react(), svgr()],
//     // ... project-specific overrides
//   }))

import { defineConfig, loadEnv, mergeConfig } from 'vite'

/**
 * Default vendor chunk groups.
 * Extend them by passing additional chunks to createManualChunks().
 */
export const defaultVendorChunks = [
  {
    chunk: 'vendor-mui',
    includes: ['@mui', '@emotion', 'styled-components', 'stylis'],
  },
  {
    chunk: 'vendor-react',
    includes: [
      '/node_modules/react/',
      '/node_modules/react-dom/',
      '/node_modules/react-router',
      '/node_modules/scheduler/',
      '@remix-run',
    ],
  },
  {
    chunk: 'vendor-charts',
    includes: [
      '/recharts/',
      '/d3-',
      '/react-smooth/',
      '/recharts-scale/',
      '/decimal.js-light/',
    ],
  },
  { chunk: 'vendor-i18n', includes: ['i18next', 'react-i18next'] },
  { chunk: 'vendor-somenergia', includes: ['@somenergia'] },
]

/**
 * Returns a Rollup `manualChunks` function that groups node_modules
 * dependencies into per-vendor chunks.
 *
 * @param {Array} extraChunks  Additional chunks checked BEFORE the defaults.
 *                             Useful for project-specific chunks (lodash, formik…).
 */
export function createManualChunks(extraChunks = []) {
  const allChunks = [...extraChunks, ...defaultVendorChunks]
  return function manualChunks(id) {
    if (!id.includes('node_modules')) return
    const match = allChunks.find(({ includes }) =>
      includes.some((pkg) => id.includes(pkg)),
    )
    return match ? match.chunk : 'vendor'
  }
}

/**
 * Creates a base Vite configuration for SPAs (web applications).
 *
 * Provides:
 * - BASE_URL loading from .env files
 * - Automatic vendor chunking
 * - Vitest configuration with jsdom
 * - Dev server on port 3000
 *
 * @param {Function|Object} factory  Either a function ({ mode, command }) => config  or a plain config object.
 *                                   Project options are deep-merged on top of the base defaults.
 *                                   Pass `plugins` here: [react(), svgr(), …]
 */
export function createAppConfig(factory = () => ({})) {
  return defineConfig(({ mode, command }) => {
    // Vite ignores non-VITE_-prefixed variables from .env files by default.
    // We read BASE_URL explicitly so the base path can vary per mode.
    process.env = { ...process.env, ...loadEnv(mode, process.cwd(), 'BASE_URL') }

    const userConfig =
      typeof factory === 'function' ? factory({ mode, command }) : factory

    return mergeConfig(
      {
        base: process.env.BASE_URL,
        build: {
          outDir: 'build',
          manifest: 'asset-manifest.json',
          cssCodeSplit: false,
          sourcemap: true,
          rollupOptions: {
            output: {
              manualChunks: createManualChunks(),
            },
          },
          target: 'es2020',
        },
        server: {
          open: true,
          port: 3000,
        },
        test: {
          globals: true,
          environment: 'jsdom',
          css: true,
        },
      },
      userConfig,
    )
  })
}
