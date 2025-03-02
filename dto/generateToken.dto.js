export default class GenerateTokenDto {
    id;
    token;
    createdAt;
    count;

    constructor(generateToken) {
        this.id = generateToken.id;
        this.token = generateToken.token;
        this.createdAt = generateToken.createdAt;
        this.count = generateToken.count;
    }
}