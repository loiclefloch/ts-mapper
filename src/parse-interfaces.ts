import { CodeBlockWriter, InterfaceDeclaration } from "ts-morph";
import { writeMapFunction } from "./mapper-writer";
import { getNamingOptionsForName } from "./options";

export function parseInterfaces(writer: CodeBlockWriter, interfaces: InterfaceDeclaration[]) {
  interfaces.forEach((node) => {
    const dtoName = node.getName();
    const dtoPropertySignatures = node.getProperties();

    const namingOption = getNamingOptionsForName(dtoName);

    writeMapFunction(writer, namingOption, dtoName, dtoPropertySignatures)
  });

}
