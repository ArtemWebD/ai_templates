export default class UnifierClasses {
    classes = {};

    /**
     * Store html classes in key-value format
     * @param {string[]} classes Array of html classes
     */
    constructor(classes) {
        this.__generateClasses(classes);
    }

    __generateClasses(classes) {
        classes.forEach((el) => {
            this.classes[el] = this.__getAlphaNumericRandom();
        });
    }

    __getAlphaNumericRandom() {
        const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const len = Math.floor(Math.random() * (10 - 4 + 1)) + 4;
        let result = '';
        while (result.length < len) {
          result += abc[Math.floor(Math.random() * abc.length)];
        }
        return result;
    }
}