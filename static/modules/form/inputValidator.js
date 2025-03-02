/**
 * Module for validating input's data
 */
export default class InputValidator {
    /**
     * Validate type and calculation of value
     * @param {InputData} inputData input's data
     * @returns {boolean}
     */
    validate(inputData) {
        return !this.isEmpty(inputData) && this.validateType(inputData);
    }

    /**
     * Check for empty value
     * @param {InputData} inputData input's data
     * @returns {boolean}
     */
    isEmpty(inputData) {
        let isEmpty = false;

        switch (inputData.type) {
            case "string":
                isEmpty = this.__isEmptyString(inputData.value);
                break;
            case "number":
                isEmpty = this.__isEmptyNumber(inputData.value);
                break;
            case "files":
                isEmpty = this.__isEmptyFiles(inputData.value);
                break;
        }

        return isEmpty;
    }

    /**
     * Check data type for compliance
     * @param {InputData} inputData input's data
     * @returns {boolean}
     */
    validateType(inputData) {
        let isValidate = false;

        switch (inputData.type) {
            case "string":
                isValidate = this.__validateString(inputData.value);
                break;
            case "number":
                isValidate = this.__validateNumber(inputData.value);
                break;
            case "files":
                isValidate = this.__validateFile(inputData.value);
                break;
            case "file":
                isValidate = true;
                break;
        }
        
        return isValidate;
    }

    __validateString(value) {
        return typeof value === "string";
    }

    __validateFile(value) {
        if (value instanceof File) {
            return true;
        }

        if (!(value instanceof FileList)) {
            return false;
        }

        for (const element of value) {
            if (!(element instanceof File)) {
                return false;
            }
        }

        return true;
    }

    __validateNumber(value) {
        return typeof value === "number";
    }

    __isEmptyString(value) {
        return !(!!value);
    }

    __isEmptyNumber(value) {
        return isNaN(value) || !isFinite(value);
    }

    __isEmptyFiles(value) {
        return !(!!value.length);
    }
}