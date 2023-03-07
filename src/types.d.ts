
export interface Options {
	source: {
			name: string;
			enumName: string;
	};
	target: {
			name: string;
			enumName: string;
	};
}

export interface WriteMapperApi {
	writeSimpleType: (propertyName: string, parameterName: string) => void;
	writeObject: (propertyName: string, mappingMethodName: string, parameterName: string) => void;
	writeArray: (propertyName: string, mappingMethodName: string, parameterName: string) => void;
	writeEnum: (propertyName: string, mappingMethodName: string, parameterName: string) => void;
}

export interface WriteMapperOptions {
	parameterName: string;
	propertyName: string;
	dtoName: string;
	//
	isOptional: boolean;
	// type
	isAny: boolean;
	isSimpleType: boolean;
	isEnum: boolean;
	isInterface: boolean;
	isType: boolean;
	isArray: boolean;
}