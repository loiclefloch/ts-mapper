import { CodeBlockWriter, InterfaceDeclaration } from "ts-morph";
import { writeFunction } from "./mapper-writer";
import { Options } from "./types";

export function parseInterfaces(writer: CodeBlockWriter, interfaces: InterfaceDeclaration[], options: Options) {
  interfaces.forEach((node) => {
    const dtoName = node.getName();
    const dtoPropertySignatures = node.getProperties();

    if (!dtoName.endsWith(options.source.name)) {
      throw new Error(`Invalid name ${dtoName}`);
    }

    writeFunction(writer, options, dtoName, dtoPropertySignatures)
  });

}
