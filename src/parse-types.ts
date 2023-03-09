import { CodeBlockWriter, PropertySignature, TypeAliasDeclaration } from 'ts-morph';
import { writeMapEnumFunction, writeMapFunction } from "./mapper-writer";
import { getNamingOptionsForName } from './options';
import { NamingOptions } from "./types";

function parseEnumAsUnion(writer: CodeBlockWriter, options: NamingOptions, dtoName: string, node: TypeAliasDeclaration) {
  const unionTypes = node
  .getType()
  .getUnionTypes()

  const enumValues = unionTypes.map(union => union.getLiteralValue());

  writeMapEnumFunction(writer, options, dtoName, enumValues)
}

function parseDto(writer: CodeBlockWriter, options: NamingOptions, dtoName: string, node: TypeAliasDeclaration) {
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
  
  writeMapFunction(writer, options, dtoName, dtoPropertySignatures)
}

export function parseTypes(writer: CodeBlockWriter, types: TypeAliasDeclaration[]) {
  types.forEach((node) => {
    const dtoName = node.getName();

    const namingOption = getNamingOptionsForName(dtoName);

    if (namingOption.isEnum) { // TODO: better
      // is an enum (union)
      parseEnumAsUnion(writer, namingOption, dtoName, node)
    } else {
      parseDto(writer, namingOption, dtoName, node);
    }   
  });

}

