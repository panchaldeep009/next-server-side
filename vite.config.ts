import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import typescript from '@rollup/plugin-typescript';
import * as ts from 'typescript';

const clientHookReplacementTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (nodeInstance: ts.Node) => {
      if (nodeInstance.kind && ts.isImportDeclaration(nodeInstance)) {
        const namedImports = nodeInstance.importClause.namedBindings;
        if (namedImports.kind && ts.isNamedImports(namedImports)) {
          const importNames = namedImports.elements.map(e => e.name.escapedText.toString());
          if(importNames.includes('createServerQuery')) {
            const newNode = ts.factory.createImportDeclaration(
              undefined,
              undefined,
              ts.factory.createImportClause(undefined, undefined, ts.factory.createNamedImports([
                ts.factory.createImportSpecifier(undefined, undefined, ts.factory.createIdentifier('ClientQuery')),
              ])),
              ts.factory.createStringLiteral('./lib/clientHook'),
            );
            return newNode;
          }
        }
      }

      if (ts.isVariableDeclaration(nodeInstance)
          && ts.isIdentifier(nodeInstance.name)
          && ts.isCallExpression(nodeInstance.initializer)
          && ts.isIdentifier(nodeInstance.initializer.expression)
          && nodeInstance.initializer.expression.text === 'createServerQuery') {
          
          const newNode = ts.factory.createVariableDeclaration(
            nodeInstance.name,
            undefined,
            undefined,
            ts.factory.createCallExpression(
              ts.factory.createIdentifier('outPutClientHook'), 
              undefined, 
              [
                ts.factory.createStringLiteral(nodeInstance.name.escapedText.toString()),
              ]
            ),
          );
          return newNode;
      }
      return ts.visitEachChild(nodeInstance, visitor, context);
    }

    if (ts.isSourceFile(sourceFile) && sourceFile.fileName.includes('src/App.tsx')) {
      return ts.visitNode(sourceFile, visitor);
    }
    return sourceFile;
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      exclude: /\.stories\.(t|j)sx?$/,
    }),
    typescript({
      compilerOptions: {
      
      },
      transformers: {
        after: [clientHookReplacementTransformer]
      },
      
    }),
  ],
  build: {
    minify: false
  }
})
