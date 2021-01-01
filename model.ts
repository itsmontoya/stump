import { state } from "./stump";

export interface model {
	get: (state: any, key: modelKey) => any
	getSelf: (state: any) => any
	find: (state: any, fn: matchFn) => any

	put: (state: any, key: modelKey, value: any) => state
	remove: (state: any, key: modelKey) => state

	model: (key: string) => model
	arrayModel: (key: string) => arrayModel
};

export interface arrayModel {
	get: (state: any, index: modelKey) => any
	getSelf: (state: any) => any[]
	find: (state: any, fn: matchFn) => any
	findIndex: (state: any, fn: matchFn) => number

	append: (state: any, value: any) => state
	update: (state: any, index: number, value: any) => state
	remove: (state: any, index: number) => state

	updateMatch: (state: any, fn: matchFn, value: any) => state
	updateOrAppendMatch: (state: any, fn: matchFn, value: any) => state
	removeMatch: (state: any, fn: matchFn) => state

	model: (key: number) => model
	arrayModel: (key: number) => arrayModel
}

export type modelKey = (string | number);
export type matchFn = (value: any) => boolean;
export type objectType = { [key: string]: any };

export const model = (key: string) =>
	newDeepModel(undefined, key);

export const arrayModel = (key: modelKey) =>
	newArrayModel(undefined, key);

type modelType = model | arrayModel | undefined;

const newDeepModel = (parent: modelType, key: modelKey): model => {
	if (typeof key === "number")
		return newModel(parent, key);

	let m: modelType = parent;
	key.split(".")
		.forEach((key: string) =>
			m = newModel(m, key))

	return <model>m;
}

const newModel = (parent: modelType, modelKey: modelKey): model => {
	const getSelf = (state: any): any =>
		parent === undefined
			? state[modelKey] || {}
			: parent.get(state, modelKey) || {};
	const get = (state: any, key: modelKey): any =>
		getSelf(state)[key]
	const find = (state: any, fn: matchFn): any =>
		getObjectMatch(getSelf(state), fn);

	const putSelf = (state: any, updated: any): state => {
		if (parent === undefined)
			return { ...state, [modelKey]: updated };
		if (parent.hasOwnProperty("put"))
			return (<model>parent).put(state, modelKey, updated);
		if (parent.hasOwnProperty("updateMatch"))
			return (<arrayModel>parent).update(state, <number>modelKey, updated);
		throw (`invalid parent model type, <${parent}> is not supported`);
	};
	const put = (state: any, key: modelKey, value: any): state =>
		putSelf(state, { ...getSelf(state), [key]: value });
	const remove = (state: any, key: modelKey): state =>
		putSelf(state, deleteObjectValue(getSelf(state), key));

	const model = (key: string): model =>
		newDeepModel(self, key);
	const arrayModel = (key: string): arrayModel =>
		newArrayModel(self, key);

	const self: model = { get, getSelf, find, put, remove, model, arrayModel };
	return self;
};

const newArrayModel = (parent: modelType, modelKey: modelKey) => {
	const getSelf = (state: any): any =>
		parent === undefined
			? state[modelKey] || []
			: parent.get(state, modelKey) || [];

	const get = (state: any, index: number): any =>
		getSelf(state)[index];

	const find = (state: any, fn: matchFn): any =>
		(<any[]>getSelf(state) || []).find(fn);
	const findIndex = (state: any, fn: matchFn): number =>
		(<any[]>getSelf(state) || []).findIndex(fn);

	const putSelf = (state: any, updated: any): state => {
		if (parent === undefined)
			return { ...state, [modelKey]: updated };
		if (parent.hasOwnProperty("put"))
			return (<model>parent).put(state, modelKey, updated);
		if (parent.hasOwnProperty("updateMatch"))
			return (<arrayModel>parent).update(state, <number>modelKey, updated);
		throw (`invalid parent model type, <${parent}> is not supported`);
	};
	const append = (state: any, value: any): state =>
		putSelf(state, [...(getSelf(state) || []), value]);
	const update = (state: any, index: number, value: any): state =>
		putSelf(state, updateArrayValue(getSelf(state) || [], index, value));
	const remove = (state: any, index: number): state =>
		putSelf(state, deleteArrayValue(getSelf(state) || [], index));

	const updateMatch = (state: any, fn: matchFn, value: any): state =>
		putSelf(state, updateMatchedArrayValue(getSelf(state) || [], fn, value));
	const updateOrAppendMatch = (state: any, fn: matchFn, value: any): state =>
		putSelf(state, updateOrAppendMatchedArrayValue(getSelf(state) || [], fn, value));
	const removeMatch = (state: any, fn: matchFn): state =>
		putSelf(state, deleteMatchedArrayValue(getSelf(state) || [], fn));

	const model = (key: number): model =>
		newDeepModel(self, key);
	const arrayModel = (key: number): arrayModel =>
		newArrayModel(self, key);

	const self: arrayModel = { get, getSelf, find, findIndex, append, update, remove, updateMatch, updateOrAppendMatch, removeMatch, model, arrayModel };
	return self;
};

const getObjectMatch = (obj: objectType, fn: matchFn): any => {
	for (let key in obj) {
		const value = obj[key];
		if (fn(value) === true) {
			return value;
		}
	}

	return null;
};

const deleteObjectValue = (obj: any, key: modelKey): any => {
	var newObj = { ...obj };
	delete (newObj[key]);
	return newObj;
}

const updateArrayValue = (arr: any[] = [], index: number, value: any): any[] =>
	index === -1
		// Value doesn't exist, pass original array back
		? [...arr]
		// Value exists, update within array
		: [...arr.slice(0, index), value, ...arr.slice(index + 1)]

const updateOrAppendArrayValue = (arr: any[] = [], index: number, value: any): any[] =>
	index === -1
		// Value doesn't exist, spread array and include new value
		? [...arr, value]
		// Value exists, update within array
		: [...arr.slice(0, index), value, ...arr.slice(index + 1)]

const deleteArrayValue = (arr: any[], index: number): any[] =>
	index === -1
		? [...arr]
		: [...arr.slice(0, index), ...arr.slice(index + 1)]

const updateMatchedArrayValue = (arr: any[] = [], fn: matchFn, value: any): any[] =>
	updateArrayValue(arr, arr.findIndex(fn), value);

const updateOrAppendMatchedArrayValue = (arr: any[] = [], fn: matchFn, value: any): any[] =>
	updateOrAppendArrayValue(arr, arr.findIndex(fn), value);

const deleteMatchedArrayValue = (arr: any[] = [], fn: matchFn): any[] =>
	deleteArrayValue(arr, arr.findIndex(fn));

