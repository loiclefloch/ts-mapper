import { CodeBlockWriter, InterfaceDeclaration } from "ts-morph";
import { Options } from "./types";
import { lowerFirstLetter } from "./util";
import { writeMapper } from "./write-mapper";

function getRelativeName(name: string) {
	if (name.includes(")")) {
		// handle import("./simple.apiobject").MyOtherInterfaceApiObject
		return name.substring(name.indexOf('").') + 3);
	}
	return name;
}

export function parseInterfaces(writer: CodeBlockWriter, interfaces: InterfaceDeclaration[], options: Options) {
  interfaces.forEach((node) => {
    const dtoName = node.getName();
    const dtoProperties = node.getProperties();

    if (!dtoName.endsWith(options.source.name)) {
      throw new Error(`Invalid name ${dtoName}`);
    }

    const newPropertyType = dtoName.replace(options.source.name, options.target.name);

    const mappingMethodName = `${lowerFirstLetter(dtoName)}To${options.target.name}`;
    const parameterName = lowerFirstLetter(dtoName);


    writer
      .write(`export function ${mappingMethodName}(${parameterName}: ${dtoName}): ${newPropertyType}`)
      .block(() => {
        writer.write(`return`).block(() => {
          dtoProperties.forEach((property) => {
            const propertyName = property.getName();
            const dtoName = getRelativeName(property.getType().getText());

            const isSimpleType =
              property.getType().isLiteral() ||
              property.getType().isBoolean() ||
              property.getType().isBooleanLiteral() ||
              property.getType().isNumber() ||
              property.getType().isNumberLiteral() ||
              property.getType().isString() ||
              property.getType().isStringLiteral();

            const isEnum = dtoName.endsWith(options.source.enumName);

            const isInterface = property.getType().isInterface();
            const isType = property.getType().isObject();
            const isArray = property.getType().isArray() || property.getType().isReadonlyArray();

            const writeMapperOptions = {
              parameterName,
              propertyName,
              dtoName,
              isSimpleType,
              isEnum,
              isInterface,
              isType,
              isArray,
            };
            const handled = writeMapper(writer, options, writeMapperOptions);
            if (!handled) {
              console.log(`Type not handled ${dtoName}`);

              console.log({
                propertyName,
                isAnonymous: property.getType().isAnonymous(),
                isAny: property.getType().isAny(),
                isNever: property.getType().isNever(),
                isArray: property.getType().isArray(),
                isReadonlyArray: property.getType().isReadonlyArray(),
                isTemplateLiteral: property.getType().isTemplateLiteral(),
                isBoolean: property.getType().isBoolean(),
                isString: property.getType().isString(),
                isNumber: property.getType().isNumber(),
                isLiteral: property.getType().isLiteral(),
                isBooleanLiteral: property.getType().isBooleanLiteral(),
                isEnumLiteral: property.getType().isEnumLiteral(),
                isNumberLiteral: property.getType().isNumberLiteral(),
                isStringLiteral: property.getType().isStringLiteral(),
                isClass: property.getType().isClass(),
                isClassOrInterface: property.getType().isClassOrInterface(),
                isEnum: property.getType().isEnum(),
                isInterface: property.getType().isInterface(),
                isObject: property.getType().isObject(),
                isTypeParameter: property.getType().isTypeParameter(),
                isTuple: property.getType().isTuple(),
                isUnion: property.getType().isUnion(),
                isIntersection: property.getType().isIntersection(),
                isUnionOrIntersection: property.getType().isUnionOrIntersection(),
                isUnknown: property.getType().isUnknown(),
                isNull: property.getType().isNull(),
                isUndefined: property.getType().isUndefined(),
              });
            }
          });
        });
      });
  });

}
