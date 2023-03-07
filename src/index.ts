import { CodeBlockWriter, Project, ScriptTarget } from "ts-morph";
import { parseInterfaces } from "./parse-interfaces";
import { parseTypes } from "./parse-types";

// AST Viewer: https://ts-ast-viewer.com/

function main() {
  const project = new Project({
    compilerOptions: {
      tsConfigFilePath: "../tsconfig.json",
      skipAddingFilesFromTsConfig: true,
      // You can override any tsconfig.json options by also providing a compilerOptions object:
      target: ScriptTarget.ES2022,
    },
  });

  const sourceFiles = project.addSourceFilesAtPaths("./tests/simple.apiobject.ts");

  // InterfaceDeclaration || TypeAliasDeclaration.TypeLiteral

  // PropertySignature:
  // identifier
  // type -> StringKeyword, NumberKeyword, BooleanKeyword

  const options = {
    source: {
      name: "ApiObject",
      enumName: "ApiEnum",
    },
    target: {
      name: "Dto",
      enumName: "DtoEnum",
    },
  };

  const sourceFile = sourceFiles[0];

  const writer = new CodeBlockWriter({
    // optional options
    newLine: "\r\n", // default: "\n"
    indentNumberOfSpaces: 2, // default: 4
    useTabs: false, // default: false
    useSingleQuote: true, // default: false
  });

  console.log(writer.toString());

	 if (false) parseInterfaces(writer, sourceFile.getInterfaces(), options);
   if (true) parseTypes(writer, sourceFile.getTypeAliases(), options);

	console.log(writer.toString());
}

// TODO: type - enum
// function pseConcreteCaseSessionStateStringToApiEnum(state: string): PseConcreteCaseSessionStateApiEnum {
// 	return assertEnum<PseConcreteCaseSessionStateApiEnum>(state, [
//     "CREATED",
//     "RUNNING",
//     "CLOSED",
//   ]);
// }


main();