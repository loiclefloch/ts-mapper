import { CodeBlockWriter, Project, ScriptTarget } from "ts-morph";
import { parseInterfaces } from "./parse-interfaces";
import { parseTypes } from "./parse-types";

// AST Viewer: https://ts-ast-viewer.com/

function run(filepath: string) {
  const project = new Project({
    compilerOptions: {
      tsConfigFilePath: "../tsconfig.json",
      skipAddingFilesFromTsConfig: true,
      // You can override any tsconfig.json options by also providing a compilerOptions object:
      target: ScriptTarget.ES2022,
    },
  });

  const sourceFiles = project.addSourceFilesAtPaths(filepath);

  // InterfaceDeclaration || TypeAliasDeclaration.TypeLiteral

  // PropertySignature:
  // identifier
  // type -> StringKeyword, NumberKeyword, BooleanKeyword

  const sourceFile = sourceFiles[0];

  const writer = new CodeBlockWriter({
    // optional options
    newLine: "\r\n", // default: "\n"
    indentNumberOfSpaces: 2, // default: 4
    useTabs: false, // default: false
    useSingleQuote: true, // default: false
  });

	 parseInterfaces(writer, sourceFile.getInterfaces());
   parseTypes(writer, sourceFile.getTypeAliases());

	const code = writer.toString()

  return code
}

function main() {
  console.log(run(process.argv[2]));
}

main();