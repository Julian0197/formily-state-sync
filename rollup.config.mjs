import path from 'node:path'
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

const input = path.resolve('src/index.ts')

const external = [
  '@formily/core',
  '@formily/reactive',
  '@formily/react',
  '@formily/antd',
  'react',
  'react-dom',
  'zustand',
  'zustand/middleware/immer',
  'immer',
  'jotai',
  'jotai-immer',
]

export default [
  {
    input,
    external,
    output: [
      { file: 'dist/index.cjs', format: 'cjs', sourcemap: true },
      { file: 'dist/index.mjs', format: 'esm', sourcemap: true },
    ],
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            declarationMap: false,
            emitDeclarationOnly: false,
          },
          include: ['src/**/*'],
        },
        useTsconfigDeclarationDir: true,
        clean: true,
      }),
    ],
  },
  {
    input,
    external,
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
]


