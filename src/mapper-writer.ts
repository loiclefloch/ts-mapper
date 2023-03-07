import { CodeBlockWriter, PropertySignature } from "ts-morph";
import { parsePropertySignature } from "./parse-property-signature";
import { Options } from "./types";
import { lowerFirstLetter } from "./util";

export function writeMapFunction(
  writer: CodeBlockWriter,
	options: Options,
  dtoName: string,
	dtoProperties: PropertySignature[]
) {
	const mappingMethodName = buildMappingMethodName(dtoName, options)
	const parameterName = buildParameterName(dtoName)
	const newPropertyType = buildNewPropertyType(dtoName, options)

  writer.write(`export function ${mappingMethodName}(${parameterName}: ${dtoName}): ${newPropertyType}`).block(() => {
    writer.write(`return`).block(() => {
			dtoProperties.forEach((propertySignature) =>
        parsePropertySignature(writer, parameterName, options, propertySignature)
      );
		});
  });
	writer.write('\n');
}

export function writeMapEnumFunction(
  writer: CodeBlockWriter,
	options: Options,
  dtoName: string,
	enumValues: any[]
) {
	const mappingMethodName = buildMappingEnumMethodName(dtoName, options)
	const parameterName = buildParameterName(dtoName)
	const newPropertyType = buildNewPropertyEnumType(dtoName, options)

	writer.write(`export function ${mappingMethodName}(${parameterName}: ${dtoName}): ${newPropertyType}`).block(() => {
    // not only handle string enums for the moment
    writer.write(
      `return assertEnum<${newPropertyType}>(${parameterName}, [ ${enumValues.map((value) => `"${value}"`).join(", ")} ]);`
    );
  });
	writer.write('\n');
}

function buildMappingMethodName(dtoName: string, options: Options): string {
	return `${lowerFirstLetter(dtoName)}To${options.target.name}`;
}

function buildMappingEnumMethodName(dtoName: string, options: Options): string {
	return `${lowerFirstLetter(dtoName)}To${options.target.enumName}`;
}

function buildParameterName(dtoName: string): string {
	return lowerFirstLetter(dtoName);
}

function buildNewPropertyType(dtoName: string, options: Options): string {
	return dtoName.replace(options.source.name, options.target.name);
}


function buildNewPropertyEnumType(dtoName: string, options: Options): string {
	return dtoName.replace(options.source.enumName, options.target.enumName);
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