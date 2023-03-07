import { CodeBlockWriter } from "ts-morph";


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