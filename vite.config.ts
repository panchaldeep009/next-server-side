import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import typescript from '@rollup/plugin-typescript';
import * as ts from 'typescript';
import * as fs from 'fs';

const clientHookReplacementTransformer: ts.TransformerFactory<ts.SourceFile> = context => {
  return sourceFile => {
    const visitor = (node: ts.Node) => {
      console.log(node.kind);
      return node;
      if (ts.isImportDeclaration(node)) {
        const namedImports = node.importClause.namedBindings;
        if (ts.isNamedImports(namedImports)) {
          const importNames = namedImports.elements.map(e => e.name.escapedText.toString());
          if(importNames.includes('createServerHook')) {
            const newNode = ts.factory.createImportDeclaration(
              undefined,
              undefined,
              ts.factory.createImportClause(undefined, undefined, ts.factory.createNamedImports([
                ts.factory.createImportSpecifier(undefined, undefined, ts.factory.createIdentifier('outPutClientHook')),
              ])),
              ts.factory.createStringLiteral('./lib/clientHook'),
            );
            return newNode;
          }
        }
      }
      if (ts.isVariableDeclaration(node)
          && ts.isIdentifier(node.name)
          && ts.isCallExpression(node.initializer)
          && ts.isIdentifier(node.initializer.expression)
          && node.initializer.expression.text === 'createServerHook') {
          
          const newNode = ts.factory.createVariableDeclaration(
            node.name,
            undefined,
            undefined,
            ts.factory.createCallExpression(
              ts.factory.createIdentifier('outPutClientHook'), 
              undefined, 
              [
                ts.factory.createStringLiteral(node.name.escapedText.toString()),
              ]
            ),
          );
          return newNode;
      }
      return ts.visitEachChild(node, visitor, context);
    }

    return ts.visitNode(sourceFile, visitor);
  };
};


const serverPlugin = (): Plugin => ({
  name: 'server-plugin',
  transform(code, id, options) {
    if(id.includes('App.tsx')) {
      const sourceMap = ts.createSourceFile(id, code, ts.ScriptTarget.Latest);
      const originalSource = { ...sourceMap };

      const result = ts.transform(sourceMap, [clientHookReplacementTransformer]);
      

        // if (ts.isImportDeclaration(statement) 
        //   && statement.moduleSpecifier.text.includes('lib/createServerHook')) {
        //     console.log('found import');
        //     statement = ts.factory.createEmptyStatement();
        // }
      fs.writeFileSync(id+ '.map.json', JSON.stringify(originalSource, null, 2));
      const printer = ts.createPrinter();
      fs.writeFileSync(id + '.changed.js', printer.printFile(result.transformed[0]));
    }
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // serverPlugin(),
    typescript({
      transformers: {
        before: [
          {
            type: 'typeChecker',
            factory: program => {
              return clientHookReplacementTransformer;
            }
          }
        ]
      }
    }),
    react({
      exclude: /\.stories\.(t|j)sx?$/,
    }),
  ],
  build: {
    minify: false
  }
})
