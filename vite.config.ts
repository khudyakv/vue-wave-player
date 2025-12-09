import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [
        vue(),
        dts({
          insertTypesEntry: true,
          include: ['src/lib/**/*'],
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/lib/index.ts'),
          name: 'VueWavePlayer',
          formats: ['es', 'umd'],
          fileName: 'vue-wave-player',
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            exports: 'named',
            globals: {
              vue: 'Vue',
            },
          },
        },
      },
    }
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        'vue-wave-player': resolve(__dirname, 'src/lib'),
      },
    },
  }
})

