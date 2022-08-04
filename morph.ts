import { Project, ts } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

project.addSourceFilesAtPaths([
  'src/**/*.ts',
  'src/**/*.tsx',
  'lib/**/*.ts',
])

const typeChecker = project.getTypeChecker();
// const res = project.getModuleResolutionHost();

project.getSourceFiles([
  'src/**/*.ts',
  'src/**/*.tsx',
  'lib/**/*.ts',
])
  .forEach(sourceFile => {
    if (sourceFile.getBaseName().includes('server')) {
      sourceFile.transform((traversal) => {
        const node = traversal.visitChildren();
          if (ts.isStringLiteral(node) && node.getText().includes('It works!')) {
            return ts.factory.createStringLiteral('It really works! good');
          }
        return node;
      })
    }

    if (sourceFile.getBaseName().includes('App')) {
      
      const moduleSymbol = typeChecker.getSymbolAtLocation(sourceFile);
      const exports = typeChecker.getExportsOfModule(moduleSymbol);
      
      exports.forEach(exportSymbol => {
        const exportName = exportSymbol.getName();
        if (exportName.includes('use')) {
          exportSymbol.getDeclarations().find((declaration) => {
            const node = declaration.getFirstChildByKind(ts.SyntaxKind.CallExpression);
            const functionSymbol = node.getFirstChildByKind(ts.SyntaxKind.Identifier);

            console.log(typeChecker.getSymbolAtLocation(functionSymbol).getDeclarations());
          })
        }
      });

      // sourceFile.getExportedDeclarations()
      // .forEach(declarations => {
      //   declarations.forEach(declaration => {
      //     if (
      //       ts.isVariableDeclaration(declaration.compilerNode)
      //       && ts.isCallExpression(declaration.compilerNode.initializer)
      //       && declaration.compilerNode.initializer.expression.getText().includes('createServerQuery')
      //     ) {
      //       // typeChecker.getReturnTypeOfSignature(declaration.compilerNode.initializer.getSignature());
      //       // console.log(typeChecker.);
      //     }
      //   })
      // });

    }
  });

export default project;