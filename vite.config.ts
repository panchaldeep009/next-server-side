import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ts from 'typescript';
import project from './morph';

const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    if (
      ts.isSourceFile(sourceFile) 
      && sourceFile.fileName.includes('/src')
    ) {
      console.log(sourceFile.fileName);
      return sourceFile;
    }
    return sourceFile;
  };
}

type ServerPluginConfig = {
  /**
   * @default 3000
   */
  port?: number;
  /**
   * @default 3100
   */
  hmrPort?: number;
  /**
   * @default './src/server.ts'
   */
  serverEntry?: string;
  /**
   * @default '/api'
   */
  apiBase?: string;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    {
      apply: 'serve',
      name: 'server-transformer',
      transform: (code, id) => {
        console.log(id);
        if (id.includes('/src')) {
          return {
            code: project.getSourceFileOrThrow(id).getFullText(),
          };
        }
        return {code};
      }
    },
    {
      apply: 'serve',
      name: 'hooks-server',
      configureServer(server) {
        server.middlewares.use(
          '/api',
          require('./src/server').default,
        );
      },
    },
    react(),
  ],
  server: {
    port: 3000,
    hmr: {
      port: 3100,
    },
  }
})
