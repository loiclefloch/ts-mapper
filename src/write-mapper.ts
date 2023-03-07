import { CodeBlockWriter } from "ts-morph";
import { buildMapperWriter } from "./mapper-writer";
import { Options, WriteMapperOptions } from "./types";
import { lowerFirstLetter } from "./util";

export function writeMapper(
  writer: CodeBlockWriter,
	options: Options,
  { parameterName, propertyName, dtoName, isOptional, isAny, isSimpleType, isEnum, isInterface, isType, isArray }: WriteMapperOptions
) {
  const mapperWriter = buildMapperWriter(writer);

  if (isSimpleType) {
    mapperWriter.writeSimpleType(propertyName, parameterName);
    return true;
  } else if (isInterface || isAny) { 
    // Note: isAny is when we do not have data about the field. We consider it to be an import we do not have access to,
    //  which means it is most likely an interface.

    const interfaceName = dtoName;
    const mappingMethodName = `${lowerFirstLetter(interfaceName)}To${options.target.name}`;

    // is based type
    const isBasedType = ["string", "number", "boolean"];
    if (isBasedType.includes(lowerFirstLetter(interfaceName))) {
      mapperWriter.writeSimpleType(propertyName, parameterName);
    } else {
      mapperWriter.writeObject(propertyName, mappingMethodName, parameterName, isOptional);
    }
    return true;
  } else if (isArray) {
    const interfaceName = dtoName.replace("[]", "");
    const mappingMethodName = `${lowerFirstLetter(interfaceName)}To${options.target.name}`;

    mapperWriter.writeArray(propertyName, mappingMethodName, parameterName, isOptional);
    return true;
  } else if (isEnum) {
    const enumName = dtoName;
    const mappingMethodName = `${lowerFirstLetter(enumName)}To${options.target.enumName}`;

    mapperWriter.writeEnum(propertyName, mappingMethodName, parameterName);
    return true;
  } else if (isType) {
    const typeName = dtoName;
    const mappingMethodName = `${lowerFirstLetter(typeName)}To${options.target.name}`;

    mapperWriter.writeObject(propertyName, mappingMethodName, parameterName, isOptional);
    return true;
  }

  return false;
}