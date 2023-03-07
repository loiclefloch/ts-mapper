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

export type MyTypeApiObject = {
	readonly str: string;
	num: number;
	strObject: String;
	numObject: Number;

	otherInterface: MyOtherInterfaceApiObject;
	otherType: MyOtherTypeApiObject // isAnonymous / ius
}

type MyOtherTypeApiObject = {
	test: string;
}