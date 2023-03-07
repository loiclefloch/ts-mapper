import { CodeBlockWriter, TypeAliasDeclaration } from "ts-morph";
import { Options } from "./types";

export function parseTypes(writer: CodeBlockWriter, types: TypeAliasDeclaration[], options: Options) {
  types.forEach((node) => {
    const dtoName = node.getName();

    if (dtoName.endsWith(options.source.enumName)) {
      // is an enum
    } else if (dtoName.endsWith(options.source.name)) {
      // is a dto
      node.getType().getSymbol()?.getMembers().forEach(symbol => {
        const propertyName = symbol.getEscapedName()

        console.log()
      })
      
      // node.getChildren().map(child => {
      //   console.log(child.get())
      // })
    } else {
      throw new Error(`Invalid name ${dtoName}`);
    }
  });

}

