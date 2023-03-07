import { CodeBlockWriter, PropertySignature, TypeAliasDeclaration } from 'ts-morph';
import { writeFunction } from "./mapper-writer";
import { Options } from "./types";

function parseEnum() {}

function parseDto(writer: CodeBlockWriter, options: Options, dtoName: string, node: TypeAliasDeclaration) {
  const symbol = node
  .getType()
  .getSymbol()
  if (!symbol) {
    return;
  }

  const dtoPropertySignatures = symbol
    .getMembers()
    .map((symbol) => symbol.getDeclarations() as PropertySignature[])
    .flat();
  
  writeFunction(writer, options, dtoName, dtoPropertySignatures)
}

export function parseTypes(writer: CodeBlockWriter, types: TypeAliasDeclaration[], options: Options) {
  types.forEach((node) => {
    const dtoName = node.getName();

    if (dtoName.endsWith(options.source.enumName)) {
      // is an enum
    } else if (dtoName.endsWith(options.source.name)) {
      parseDto(writer, options, dtoName, node);
    } else {
      throw new Error(`Invalid name ${dtoName}`);
    }
  });

}

