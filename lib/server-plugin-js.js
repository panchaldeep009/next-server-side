import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import Case from 'case';

const serverHookInitializer =
  'createServerQuery';
const serverMutationHookInitializer =
  'createServerMutation';

export const getServerHooks = (dir) => {
  const scriptFiles = [];
  const hooks = {};
  
  function ThroughDirectory(Directory) {
    fs.readdirSync(Directory).forEach(File => {
      const Absolute = path.join(Directory, File);
      if (fs.statSync(Absolute).isDirectory()) {
        return ThroughDirectory(Absolute)
      };
      if (File.endsWith('.js') || File.endsWith('.ts') || File.endsWith('.jsx') || File.endsWith('.tsx')) {
        scriptFiles.push(Absolute);
      }
      return;
    });
  }

  ThroughDirectory(dir);

  scriptFiles
  .forEach((file) => {
    const fileContent = fs.readFileSync(file, 'utf8');
    if (!(fileContent.includes(serverHookInitializer) || fileContent.includes(serverMutationHookInitializer))) {
      return;
    }

    const source = ts.createSourceFile(file, fileContent, ts.ScriptTarget.Latest, true);
    let hookIdentifier = null;
    source.statements.find(statement => {
      if(
        ts.isVariableStatement(statement)
        // && statement.modifiers.includes(ts.ModifierFlags.Export)
        && statement.declarationList.declarations[0]
        && ts.isVariableDeclaration(statement.declarationList.declarations[0])
        && ts.isCallExpression(statement.declarationList.declarations[0].initializer)
        && [serverHookInitializer, serverMutationHookInitializer]
          .includes(statement.declarationList.declarations[0].initializer.expression.text)
        ) {
          hookIdentifier = {
            name: statement.declarationList.declarations[0].name.text,
            method: statement.declarationList.declarations[0].initializer.expression.text === serverHookInitializer ? 'query' : 'mutation'
          };
          return true;
        }
        return false;
    });

    if (!hookIdentifier) {
      return;
    }
    
    hooks[file] = hookIdentifier;
  })
  
  return hooks; 
}

const createRoute = (hook, method, subroute) => {
  const path = Case.kebab(hook.replace(/^use/, ''));
  return ts.factory.createExpressionStatement(ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(
      ts.factory.createIdentifier("app"),
      ts.factory.createIdentifier(method)
    ),
    undefined,
    [
      ts.factory.createStringLiteral(`/api/${subroute}/${path}`),
      ts.factory.createArrowFunction(
        [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)],
        undefined,
        [
          ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            ts.factory.createIdentifier("req"),
            undefined,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            undefined
          ),
          ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            ts.factory.createIdentifier("res"),
            undefined,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            undefined
          )
        ],
        undefined,
        ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.factory.createBlock(
          [
            ts.factory.createVariableStatement(
              undefined,
              ts.factory.createVariableDeclarationList(
                [ts.factory.createVariableDeclaration(
                  ts.factory.createIdentifier("result"),
                  undefined,
                  undefined,
                  ts.factory.createAwaitExpression(ts.factory.createCallExpression(
                    ts.factory.createIdentifier(hook),
                    undefined,
                    [
                      ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("req"),
                        ts.factory.createIdentifier(method === "get" ? "query" : "body")
                      ),
                      ts.factory.createIdentifier("context")
                    ]
                  ))
                )],
                ts.NodeFlags.Const | ts.NodeFlags.AwaitContext | ts.NodeFlags.ContextFlags | ts.NodeFlags.TypeExcludesFlags
              )
            ),
            ts.factory.createExpressionStatement(ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier("res"),
                ts.factory.createIdentifier("json")
              ),
              undefined,
              [ts.factory.createIdentifier("result")]
            ))
          ],
          true
        )
      )
    ]
  ))
}

export const serverFileTransformer = (serverHooks) => (context) => {
  return (sourceFile) => {
    const visitor = (nodeInstance) => {
      if (ts.isExpressionStatement(nodeInstance)
        && ts.isCallExpression(nodeInstance.expression)
        && ts.isPropertyAccessExpression(nodeInstance.expression.expression)
        && nodeInstance.expression.expression.name.escapedText === 'listen'
      ) {
        return [
          ...Object.values(serverHooks).map(({ name, method }) => {
            return createRoute(name, method === 'query' ? 'get' : 'post', method);
          }),
          nodeInstance,
        ]
      }
      return ts.visitEachChild(nodeInstance, visitor, context);
    }

    if (ts.isSourceFile(sourceFile) && sourceFile.fileName.includes('src/server.ts')) {
      const newSourceFile = ts.visitNode(sourceFile, visitor, context);
      const serverFileDir = path.dirname(sourceFile.fileName);
      const scourceFileWithImports = ts.factory.updateSourceFile(newSourceFile, [
        ...Object.entries(serverHooks).map(([file, { name: hook }]) => {
          return ts.factory.createImportDeclaration(
            undefined,
            undefined,
            ts.factory.createImportClause(
              false,
              undefined,
              ts.factory.createNamedImports(
                [
                  ts.factory.createImportSpecifier(
                    false,
                    undefined,
                    ts.factory.createIdentifier(hook)
                  )
                ]
              )
            ),
            ts.factory.createStringLiteral(
              './' +
              path.relative(serverFileDir, file)
                .replace(/\.(tsx|jsx|js|ts)$/, '')
            ),
            undefined
          )
        }
        ),
        ...newSourceFile.statements
      ])
      return scourceFileWithImports;
    }
    return sourceFile;
  };
};
