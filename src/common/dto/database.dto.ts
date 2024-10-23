import { IDataBaseResult } from "../interface/base.interface";

export class ResultDataBaseDto implements IDataBaseResult {
    result: boolean;
    value: any;

    constructor(result: boolean, value: any) {
        this.result = result;
        this.value = value;
    }
}