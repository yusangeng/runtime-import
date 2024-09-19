import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    target: 'es2015',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RuntimeImport',
      fileName: 'runtime-import',
      formats: ['umd']
    }
  },
  test: {
    include: ['src/**/*.spec.ts'],
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      // https://playwright.dev
      providerOptions: {}
    }
  }
})
