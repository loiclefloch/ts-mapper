import { CodeBlockWriter, PropertySignature } from "ts-morph";
import { parsePropertySignature } from "./parse-property-signature";
import { Options } from "./types";
import { lowerFirstLetter } from "./util";

export function writeFunction(
  writer: CodeBlockWriter,
	options: Options,
  dtoName: string,
	dtoProperties: PropertySignature[]
) {
	const mappingMethodName = `${lowerFirstLetter(dtoName)}To${options.target.name}`;
	const parameterName = lowerFirstLetter(dtoName);
	const newPropertyType = dtoName.replace(options.source.name, options.target.name);

  writer.write(`export function ${mappingMethodName}(${parameterName}: ${dtoName}): ${newPropertyType}`).block(() => {
    writer.write(`return`).block(() => {
			dtoProperties.forEach((propertySignature) =>
        parsePropertySignature(writer, parameterName, options, propertySignature)
      );
		});
  });
}

export function buildMapperWriter(writer: CodeBlockWriter) {
	return {
		writeSimpleType: (propertyName: string, parameterName: string) => {
			writer.writeLine(`${propertyName}: ${parameterName}.${propertyName},`);
		},
		writeObject: (propertyName: string, mappingMethodName: string, parameterName: string) => {
			writer.writeLine(`${propertyName}: ${mappingMethodName}(${parameterName}.${propertyName}),`);
		},
		writeArray: (propertyName: string, mappingMethodName: string, parameterName: string) => {
			writer.writeLine(`${propertyName}: ${parameterName}.${propertyName}.map(${mappingMethodName}),`);
		},
		writeEnum: (propertyName: string, mappingMethodName: string, parameterName: string) => {
			writer.writeLine(`${propertyName}: ${mappingMethodName}(${parameterName}.${propertyName}),`);
		},
	};
}