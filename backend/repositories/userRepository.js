import pool from "../config/db.js";

/*
|--------------------------------------------------------------------------
| Find user by email
|--------------------------------------------------------------------------
*/

export async function findByEmail(email) {

    const { rows } = await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [email]
    );
    return rows[0];
}

/*
|--------------------------------------------------------------------------
| Find user by id
|--------------------------------------------------------------------------
*/

export async function findById(id) {

    const { rows } = await pool.query(
        `
        SELECT
            id,
            username,
            email,
            avatar_url,
            created_at
        FROM users
        WHERE id = $1
        `,
        [id]
    );

    return rows[0];
}

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/

export async function createUser(client, user) {

    const { rows } = await client.query(
        `
        INSERT INTO users
        (
            id,
            username,
            email,
            password,
            avatar_url
        )
        VALUES
        ($1,$2,$3,$4,$5)
        RETURNING
            id,
            username,
            email,
            avatar_url,
            created_at
        `,
        [
            user.id,
            user.username,
            user.email,
            user.password,
            user.avatarUrl
        ]
    );

    return rows[0];
}

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export async function updateProfile(
    userId,
    username,
    avatarUrl
) {

    const { rows } = await pool.query(
        `
        UPDATE users
        SET
            username = $2,
            avatar_url = $3
        WHERE id = $1
        RETURNING
            id,
            username,
            email,
            avatar_url,
            created_at
        `,
        [
            userId,
            username,
            avatarUrl
        ]
    );

    return rows[0];
}

/*
|--------------------------------------------------------------------------
| Update Password
|--------------------------------------------------------------------------
*/

export async function updatePassword(
    userId,
    hashedPassword
) {

    await pool.query(
        `
        UPDATE users
        SET password = $2
        WHERE id = $1
        `,
        [
            userId,
            hashedPassword
        ]
    );

}

/*
|--------------------------------------------------------------------------
| Check Email Exists
|--------------------------------------------------------------------------
*/

export async function emailExists(email) {

    const { rows } = await pool.query(
        `
        SELECT EXISTS
        (
            SELECT 1
            FROM users
            WHERE email = $1
        ) AS exists
        `,
        [email]
    );

    return rows[0].exists;
}

/*
|--------------------------------------------------------------------------
| Search Users
|--------------------------------------------------------------------------
*/

export async function searchUsers(query, currentUserId) {

    const { rows } = await pool.query(
        `
        SELECT
            id,
            username,
            email,
            avatar_url
        FROM users
        WHERE
            id != $2
            AND
            (
                LOWER(username) LIKE LOWER($1)
                OR
                LOWER(email) LIKE LOWER($1)
            )
        ORDER BY username
        LIMIT 10
        `,
        [
            `%${query}%`,
            currentUserId
        ]
    );

    return rows;

}