export interface MyInterfaceApiObject {
	optional?: boolean;
	optArray?: Array<boolean>;
	optOther?: MyOtherInterfaceApiObject;
}
// type MyApiEnum = 'A' | 'B';

// export interface MyInterfaceApiObject {
// 	readonly str: string;
// 	num: number;
// 	strObject: String;
// 	numObject: Number;

// 	other: MyOtherInterfaceApiObject;
// 	otherType: MyOtherTypeApiObject

// 	enumValue: MyApiEnum
// }

// export interface MyOtherInterfaceApiObject {
// 	test: string;
// }

// export type MyTypeApiObject = {
// 	readonly str: string;
// 	num: number;
// 	strObject: String;
// 	numObject: Number;

// 	otherInterface: MyOtherInterfaceApiObject;
// 	otherType: MyOtherTypeApiObject // isAnonymous / ius

// 	enumValue: MyApiEnum
// }

// type MyOtherTypeApiObject = {
// 	test: string;
// }
