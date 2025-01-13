export default class UserDto {
    email;
    name;
    type;
    id;

    constructor(user) {
        this.email = user.email;
        this.name = user.name;
        this.id = user.id;
        this.type = user.type;
    }
}