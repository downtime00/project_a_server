import { ConflictException } from "@nestjs/common";
import { IBaseRespon, IDataBaseResult, IJsonRespon } from "../interface/base.interface";
import { ResultDataBaseDto } from "./database.dto";
import { HttpMessages, IHttpError } from "../enum/message.enum";

export class ResponDto implements IBaseRespon, IJsonRespon {
    value: string | any = '';
    result: boolean = false;
    respon(): any {
        return { result: this.result, value: this.value };
    }
}

class SuccessResponDto extends ResponDto {
    constructor(data: any) {
        super();
        this.result = true;
        this.value = data;
    }
    respon() {
        return { result: this.result, value: this.value };
    }
}

class FailResponDto extends ResponDto {
    constructor(data: any) {
        super();
        this.result = false;
        this.value = data;
    }
    respon() {
        const failMessage = HttpMessages.Failed_message(this.value)
        throw new ConflictException(
            {
                statusCode: failMessage.code,
                message: failMessage.message,
                error: failMessage.error,
            }
        );
    }
}
export class ResponDtoFactory {
    static createRespon(databaseResult: ResultDataBaseDto): ResponDto {
        if (databaseResult.result == true) {
            return new SuccessResponDto(databaseResult.value);
        } else {
            return new FailResponDto(databaseResult.value);
        }
    }

    static createFailRespon(failMessage: IHttpError): ResponDto {
        throw new ConflictException(
            {
                statusCode: failMessage.code,
                message: failMessage.message,
                error: failMessage.error,
            }
        );
    }
    static createSuccessRespon(databaseResult: ResultDataBaseDto): ResponDto {
        return new SuccessResponDto(databaseResult.value);
    }
}
