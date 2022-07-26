import typescript from '@rollup/plugin-typescript';
import path from 'path';
import { getServerHooks, serverFileTransformer } from './lib/server-plugin-js';

const serverHooks = getServerHooks(path.join(__dirname, './src'));

export default {
  input: 'src/server.ts',
  watch: {
    include: 'src/**'
  },
  output: {
    dir: 'dist/server',
    format: 'cjs',
  },
  plugins: [
    typescript({
      transformers: {
        before: [
          serverFileTransformer(serverHooks),
        ],
      }
    })
  ],
};
