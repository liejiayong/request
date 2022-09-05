import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const mode = process.env.MODE;
const isProd = mode === 'prod';

const external = [
  // ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
  // ...Object.keys(pkg.peerDependencies),
];

export default [
  {
    input: `lib/index.ts`,
    external,
    output: [
      {
        file: pkg.main,
        exports: 'named',
        format: 'cjs',
        sourcemap: !isProd
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: !isProd
      },
      {
        file: pkg.iife,
        name: 'MyLib',
        format: 'iife',
        sourcemap: !isProd
      },
    ],
    plugins: [typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: { compilerOptions: { sourceMap: !isProd } }
    })],
  },
  {
    input: 'build/types/index.d.ts',
    output: [
      {
        file: pkg.types,
        format: 'es'
      }
    ],
    plugins: [dts()],
  },
];
