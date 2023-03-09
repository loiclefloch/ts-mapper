import { NamingOptions } from "./types";

const EntityToApiObject = {
	source: {
		name: "Entity",
		enumName: "EntityEnum",
	},
	target: {
		name: "ApiObject",
		enumName: "ApiEnum",
	},
} as const

const ApiObjectToDto = {
	source: {
		name: "ApiObject",
		enumName: "ApiEnum",
	},
	target: {
		name: "Dto",
		enumName: "DtoEnum",
	},
} as const

const DtoToApiObject = {
	source: {
		name: "Dto",
		enumName: "DtoEnum",
	},
	target: {
		name: "ApiObject",
		enumName: "ApiEnum",
	},
} as const

const config = {
	Entity: EntityToApiObject,
	EntityEnum: { ...EntityToApiObject, isEnum: true },
	ApiObject: ApiObjectToDto,
	ApiEnum: { ...EntityToApiObject, isEnum: true },
	Dto: { ...DtoToApiObject },
	DtoEnum: { ...DtoToApiObject, isEnum: true },
} as const

export function getNamingOptionsForName(name: string): NamingOptions {
	const keys = Object.keys(config)

	const key = keys.find(key => name.endsWith(key))
	if (!key) {
		throw new Error(`No configuration found for ${name}`)
	}

	// @ts-ignore
	const namingOptions = config[key]
	return namingOptions
}
