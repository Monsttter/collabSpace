import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const EXPIRES_IN = "7d";

/*
|--------------------------------------------------------------------------
| Generate Token
|--------------------------------------------------------------------------
*/

export function generateToken(user) {

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name
        },
        JWT_SECRET,
        {
            expiresIn: EXPIRES_IN
        }
    );

}

/*
|--------------------------------------------------------------------------
| Verify Token
|--------------------------------------------------------------------------
*/

export function verifyToken(token) {

    return jwt.verify(
        token,
        JWT_SECRET
    );

}