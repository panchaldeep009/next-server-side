import typescript from '@rollup/plugin-typescript';
import * as ts from 'typescript';

const serverImports = [
  'react-stack',
  'react-stack/server',
]

const clientImport =
  'react-stack/client';

const serverHookInitializer =
  'createServerQuery';

const clientHookInitializer =
  'ClientQuery';

const clientHookReplacementTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (nodeInstance: ts.Node) => {
      if (nodeInstance.kind && ts.isImportDeclaration(nodeInstance)) {
        const namedImports = nodeInstance.importClause?.namedBindings;
        if (namedImports && ts.isNamedImports(namedImports)) {
          const importNames = namedImports.elements.map(e => e.name.escapedText.toString());
          console.log(nodeInstance);
          if(importNames.includes(serverHookInitializer)) {
            const newNode = ts.factory.createImportDeclaration(
              undefined,
              undefined,
              ts.factory.createImportClause(false, undefined, ts.factory.createNamedImports([
                ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier(clientHookInitializer)),
              ])),
              ts.factory.createStringLiteral(clientImport),
            );
            return newNode;
          }
        }
      }

      if (ts.isVariableDeclaration(nodeInstance)
          && ts.isIdentifier(nodeInstance.name)
          && nodeInstance.initializer
          && ts.isCallExpression(nodeInstance.initializer)
          && ts.isIdentifier(nodeInstance.initializer.expression)
          && nodeInstance.initializer.expression.text === serverHookInitializer) {
          
          const newNode = ts.factory.createVariableDeclaration(
            nodeInstance.name,
            undefined,
            undefined,
            ts.factory.createCallExpression(
              ts.factory.createIdentifier(clientHookInitializer), 
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

export const reactStack = () => 
  typescript({
    transformers: {
      after: [clientHookReplacementTransformer]
    },
  })