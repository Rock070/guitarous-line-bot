const typescript = require('@rollup/plugin-typescript')
const json = require('@rollup/plugin-json')
const { defineConfig } = require('rollup')

const rollupConfig = defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'api/linewebhook.js',
    format: 'cjs',
  },
  plugins: [typescript(), json()],
})

module.exports = rollupConfig
