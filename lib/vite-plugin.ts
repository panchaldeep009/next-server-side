import * as ts from 'typescript';

const serverHookInitializer =
  'createServerQuery';
const clientHookInitializer =
  'createClientQuery';

const serverMutationHookInitializer =
  'createServerMutation';
const clientMutationHookInitializer =
  'createClientMutation';

export const clientHookReplacementTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (nodeInstance: ts.Node): ts.Node => {
      if (ts.isImportSpecifier(nodeInstance)
        && ts.isIdentifier(nodeInstance.name)
        && [serverHookInitializer, serverMutationHookInitializer]
          .includes(nodeInstance.name.escapedText as string)
        // && nodeInstance.name.escapedText === serverHookInitializer
      ) {
        if (nodeInstance.name.escapedText === serverHookInitializer) {
          return ts.factory.createImportSpecifier(
            false,
            ts.factory.createIdentifier(clientHookInitializer),
            ts.factory.createIdentifier(serverHookInitializer)
          )
        }
        return ts.factory.createImportSpecifier(
          false,
          ts.factory.createIdentifier(clientMutationHookInitializer),
          ts.factory.createIdentifier(serverMutationHookInitializer)
        )
      }
      if (ts.isVariableDeclaration(nodeInstance)
          && ts.isIdentifier(nodeInstance.name)
          && nodeInstance.initializer
          && ts.isCallExpression(nodeInstance.initializer)
          && ts.isIdentifier(nodeInstance.initializer.expression)
          && [serverHookInitializer, serverMutationHookInitializer]
            .includes(nodeInstance.initializer.expression.text)) {
          
          const newNode = ts.factory.createVariableDeclaration(
            nodeInstance.name,
            undefined,
            undefined,
            ts.factory.createCallExpression(
              ts.factory.createIdentifier(nodeInstance.initializer.expression.text), 
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

    if (ts.isSourceFile(sourceFile) && sourceFile.fileName.includes('/src')) {
      return ts.visitNode(sourceFile, visitor);
    }
    return sourceFile;
  };
};
