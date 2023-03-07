import { CodeBlockWriter, Project, ScriptTarget } from "ts-morph";

// AST Viewer: https://ts-ast-viewer.com/

const project = new Project({
	compilerOptions: {
		tsConfigFilePath: "../tsconfig.json",
  	skipAddingFilesFromTsConfig: true,
		// You can override any tsconfig.json options by also providing a compilerOptions object:
    target: ScriptTarget.ES2022,
  },
});

const sourceFiles = project.addSourceFilesAtPaths("./tests/simple.apiobject.ts")

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

const sourceFile = sourceFiles[0]
const interfaces = sourceFile.getInterfaces();

const writer = new CodeBlockWriter({
  // optional options
  newLine: "\r\n",         // default: "\n"
  indentNumberOfSpaces: 2, // default: 4
  useTabs: false,          // default: false
  useSingleQuote: true     // default: false
});

console.log(writer.toString());

interfaces.forEach(node => {
	const name = node.getName();
	const properties = node.getProperties();

	if (!name.includes(options.source.name)) {
		throw new Error(`Invalid name ${name}`)
	}

	const newName = name.replace(options.source.name, options.target.name)

	const mappingMethodName = `${lowerFirstLetter(name)}To${options.target.name}`
	const parameterName = lowerFirstLetter(name)

	console.log({ newName, name, mappingMethodName, parameterName })

	const api = {
    writeSimpleType: (propertyName: string, parameterName: string) => {
      writer.writeLine(`${propertyName}: ${parameterName}.${propertyName},`);
    },
		writeObject: (propertyName: string, mappingMethodName: string, parameterName: string) => {
			writer.writeLine(`${propertyName}: ${mappingMethodName}(${parameterName}.${propertyName}),`);
		},
		writeArray: (propertyName: string, mappingMethodName: string, parameterName: string) => {
			writer.writeLine(`${propertyName}: ${parameterName}.${propertyName}.map(${mappingMethodName}),`);
		},
		writeEnum: (propertyName: string, mappingMethodName: string) => {
			writer.writeLine(`${propertyName}: ${mappingMethodName}(${parameterName}.${propertyName}),`);
		}
  };

	writer.write(`export function ${mappingMethodName}()`).block(() => {
		writer.write(`return`).block(() => {
      properties.forEach((property) => {
        const propertyName = property.getName();

        const isSimpleType =
          property.getType().isLiteral()
          || property.getType().isBoolean()
          || property.getType().isBooleanLiteral()
          || property.getType().isNumber()
          || property.getType().isNumberLiteral()
          || property.getType().isString()
          || property.getType().isStringLiteral();

				const isEnum = property.getType().getText().endsWith(options.source.enumName)

				const isInterface = property.getType().isInterface();

				const isArray = property.getType().isArray() || property.getType().isReadonlyArray();

				console.log({ propertyName, isEnum, isSimpleType, isInterface, isArray, })

				if (isSimpleType) {
					api.writeSimpleType(propertyName, parameterName)
				} else if (isInterface) {
					const interfaceName = getInterfaceName(property.getType().getText())
					const mappingMethodName = `${lowerFirstLetter(interfaceName)}To${options.target.name}`


					// is based type
					const isBasedType = [
						"string",
						"number",
						"boolean"
					]
					if (isBasedType.includes(lowerFirstLetter(interfaceName))) {
						api.writeSimpleType(propertyName, parameterName)
					} else {
						api.writeObject(propertyName, mappingMethodName, parameterName)
					}

				} else if (isArray) {
					const interfaceName = property.getType().getText().replace("[]", "")
					const mappingMethodName = `${lowerFirstLetter(interfaceName)}To${options.target.name}`

					api.writeArray(propertyName, mappingMethodName, parameterName);
				} else if (isEnum) {
					const enumName = property.getType().getText()
					const mappingMethodName = `${lowerFirstLetter(enumName)}To${options.target.enumName}`

					api.writeEnum(propertyName, mappingMethodName);
				} else {
					console.log(`Type not handled ${property.getType().getText()}`)
				}
      });
    });
	});
})

function getInterfaceName(name: string) {
	if (name.includes(")")) { // handle import("./simple.apiobject").MyOtherInterfaceApiObject
		return name.substring(name.indexOf("\").") + 3)
	}
	return name
}

console.log(writer.toString());

function lowerFirstLetter(string: string) {
	return string.charAt(0).toLowerCase() + string.slice(1);
}

// TODO: types - interface
// TODO: type - enum
// TODO: enums