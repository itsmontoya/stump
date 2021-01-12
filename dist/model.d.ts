import { state } from "./stump";
export interface model {
    get: (state: any, key: modelKey) => any;
    getSelf: (state: any) => any;
    find: (state: any, fn: matchFn) => any;
    put: (state: any, key: modelKey, value: any) => state;
    remove: (state: any, key: modelKey) => state;
    model: (key: string) => model;
    arrayModel: (key: string) => arrayModel;
}
export interface arrayModel {
    get: (state: any, index: modelKey) => any;
    getSelf: (state: any) => any[];
    find: (state: any, fn: matchFn) => any;
    findIndex: (state: any, fn: matchFn) => number;
    append: (state: any, value: any) => state;
    update: (state: any, index: number, value: any) => state;
    remove: (state: any, index: number) => state;
    updateMatch: (state: any, fn: matchFn, value: any) => state;
    updateOrAppendMatch: (state: any, fn: matchFn, value: any) => state;
    removeMatch: (state: any, fn: matchFn) => state;
    model: (key: number) => model;
    arrayModel: (key: number) => arrayModel;
}
export declare type modelKey = (string | number);
export declare type matchFn = (value: any) => boolean;
export declare type objectType = {
    [key: string]: any;
};
export declare const model: (key: string) => model;
export declare const arrayModel: (key: modelKey) => arrayModel;
