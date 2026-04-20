import type { Linter } from 'eslint'

/**
 * Base ESLint configuration (flat config, ESLint 9).
 *
 * Includes rules for: React, React Hooks, react-refresh, Prettier,
 * import order (simple-import-sort), unused imports, and promise best-practices.
 *
 * @example
 * // eslint.config.mjs
 * import baseConfig from '@somenergia/frontend-config/eslint'
 * export default [...baseConfig, { /* project-specific overrides *\/ }]
 */
declare const config: Linter.Config[]
export default config
