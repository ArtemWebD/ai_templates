export default class UserDto {
    email;
    name;
    type;
    id;
    generateTokens;

    constructor(user) {
        this.email = user.email;
        this.name = user.name;
        this.id = user.id;
        this.type = user.type;
        this.generateTokens = user.generateTokens;
    }
}