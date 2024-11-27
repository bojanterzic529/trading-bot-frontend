import { toast } from "react-toastify";

interface Data {
    value: any;
    validatorMethod: (v: any) => boolean;
    message: string;
}

function validator(dataArray: Data[]) {
    // validate for each value
    for(let data of dataArray) {
        let { value, validatorMethod, message } = data;
        if (!validatorMethod(value)) {
            toast.error(message);
            return [false, message]
        };
    }

    // success after pass all validators
    return [true, ''];
}

export default validator;