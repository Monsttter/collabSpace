import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/*
|--------------------------------------------------------------------------
| Hash Password
|--------------------------------------------------------------------------
*/

export async function hashPassword(password) {

    return bcrypt.hash(
        password,
        SALT_ROUNDS
    );

}

/*
|--------------------------------------------------------------------------
| Compare Password
|--------------------------------------------------------------------------
*/

export async function comparePassword(
    password,
    hash
) {

    return bcrypt.compare(
        password,
        hash
    );

}