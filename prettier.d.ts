import type { Config } from 'prettier'

/**
 * Base Prettier configuration.
 *
 * @example
 * // package.json
 * { "prettier": "@somenergia/frontend-config/prettier" }
 *
 * // prettier.config.mjs
 * import config from '@somenergia/frontend-config/prettier'
 * export default config
 */
declare const config: Config
export default config
