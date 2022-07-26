import * as ts from 'typescript';

const serverHookInitializer =
  'createServerQuery';
const clientHookInitializer =
  'createClientQuery';

export const clientHookReplacementTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (nodeInstance: ts.Node): ts.Node => {
      if (ts.isImportSpecifier(nodeInstance)
        && ts.isIdentifier(nodeInstance.name)
        && nodeInstance.name.escapedText === serverHookInitializer
      ) {
        return ts.factory.createImportSpecifier(
          false,
          ts.factory.createIdentifier(clientHookInitializer),
          ts.factory.createIdentifier(serverHookInitializer)
        )
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
              ts.factory.createIdentifier(serverHookInitializer), 
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
