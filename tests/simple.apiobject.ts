type MyApiEnum = 'A' | 'B';

export interface MyInterfaceApiObject {
	readonly str: string;
	num: number;
	strObject: String;
	numObject: Number;

	other: MyOtherInterfaceApiObject;
	otherType: MyOtherTypeApiObject
}

export interface MyOtherInterfaceApiObject {
	test: string;
}

export type MyType = {
	readonly str: string;
	num: number;
	strObject: String;
	numObject: Number;

	other: MyOtherInterfaceApiObject;
	otherType: MyOtherTypeApiObject
}

type MyOtherTypeApiObject = {
	test: string;
}
