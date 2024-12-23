export default class UserDto {
    email;
    name;
    id;

    constructor(user) {
        this.email = user.email;
        this.name = user.name;
        this.id = user.id;
    }
}