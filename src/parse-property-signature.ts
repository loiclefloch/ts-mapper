import { CodeBlockWriter, PropertySignature } from "ts-morph";
import { Options, WriteMapperOptions } from "./types";
import { writeMapper } from "./write-mapper"; // TODO: circular dependency

function getRelativeName(name: string) {
	if (name.includes(")")) {
		// handle import("./simple.apiobject").MyOtherInterfaceApiObject
		return name.substring(name.indexOf('").') + 3);
	}
	return name;
}

export function parsePropertySignature(
	writer: CodeBlockWriter,
	parameterName: string,
	options: Options,
	propertySignature: PropertySignature
	) {
	const propertyName = propertySignature.getName();
	const dtoName = getRelativeName(propertySignature.getType().getText());

	const isOptional = propertySignature.hasQuestionToken();

	// TRICK: remove optional token to get the same propertyType data as without question token
	propertySignature.setHasQuestionToken(false);

	const propertyType = propertySignature.getType()

	const isSimpleType =
		propertyType.isLiteral() ||
		propertyType.isBoolean() ||
		propertyType.isBooleanLiteral() ||
		propertyType.isNumber() ||
		propertyType.isNumberLiteral() ||
		propertyType.isString() ||
		propertyType.isStringLiteral();

	const isEnum = dtoName.endsWith(options.source.enumName);

	const isInterface = propertyType.isInterface();
	const isType = propertyType.isObject();
	const isArray = propertyType.isArray() || propertyType.isReadonlyArray();

	const isAny  = propertyType.isAny();

	const writeMapperOptions: WriteMapperOptions = {
		parameterName,
		propertyName,
		dtoName,
		//
		isOptional,
		//
		isAny,
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
			isOptional,
			isAnonymous: propertyType.isAnonymous(),
			isAny: propertyType.isAny(),
			isNever: propertyType.isNever(),
			isArray: propertyType.isArray(),
			isReadonlyArray: propertyType.isReadonlyArray(),
			isTemplateLiteral: propertyType.isTemplateLiteral(),
			isBoolean: propertyType.isBoolean(),
			isString: propertyType.isString(),
			isNumber: propertyType.isNumber(),
			isLiteral: propertyType.isLiteral(),
			isBooleanLiteral: propertyType.isBooleanLiteral(),
			isEnumLiteral: propertyType.isEnumLiteral(),
			isNumberLiteral: propertyType.isNumberLiteral(),
			isStringLiteral: propertyType.isStringLiteral(),
			isClass: propertyType.isClass(),
			isClassOrInterface: propertyType.isClassOrInterface(),
			isEnum: propertyType.isEnum(),
			isInterface: propertyType.isInterface(),
			isObject: propertyType.isObject(),
			isTypeParameter: propertyType.isTypeParameter(),
			isTuple: propertyType.isTuple(),
			isUnion: propertyType.isUnion(),
			isIntersection: propertyType.isIntersection(),
			isUnionOrIntersection: propertyType.isUnionOrIntersection(),
			isUnknown: propertyType.isUnknown(),
			isNull: propertyType.isNull(),
			isUndefined: propertyType.isUndefined(),
		});
	}
}