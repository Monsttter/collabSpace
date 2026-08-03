import pool from "../config/db.js";

/*
|--------------------------------------------------------------------------
| Find member
|--------------------------------------------------------------------------
*/

export async function findMember(documentId,userId){

    const { rows } = await pool.query(

        `

        SELECT *

        FROM document_members

        WHERE

        document_id=$1

        AND

        user_id=$2

        `,

        [

            documentId,

            userId

        ]

    );

    return rows[0];

}

/*
|--------------------------------------------------------------------------
| Add Member
|--------------------------------------------------------------------------
*/

export async function addMember(

    documentId,

    userId,

    role,

    invitedBy

){

    const { rows } = await pool.query(

        `

        INSERT INTO document_members(

            document_id,

            user_id,

            role,

            invited_by

        )

        VALUES(

            $1,

            $2,

            $3,

            $4

        )

        RETURNING *

        `,

        [

            documentId,

            userId,

            role,

            invitedBy

        ]

    );

    return rows[0];

}

/*
|--------------------------------------------------------------------------
| Already Member
|--------------------------------------------------------------------------
*/

export async function isMember(

    documentId,

    userId

){

    const { rows } = await pool.query(

        `

        SELECT 1

        FROM document_members

        WHERE

        document_id=$1

        AND

        user_id=$2

        `,

        [

            documentId,

            userId

        ]

    );

    return rows.length>0;

}

/*
|--------------------------------------------------------------------------
| Members
|--------------------------------------------------------------------------
*/

export async function getMembers(

    documentId

){

    const { rows } = await pool.query(

        `

        SELECT

        u.id,

        u.name,

        u.email,

        u.avatar_url,

        dm.role,

        dm.favorite,

        dm.pinned,

        dm.joined_at

        FROM users u

        INNER JOIN document_members dm

        ON

        u.id=dm.user_id

        WHERE

        dm.document_id=$1

        ORDER BY

        CASE dm.role

            WHEN 'owner' THEN 1

            WHEN 'editor' THEN 2

            WHEN 'commenter' THEN 3

            ELSE 4

        END,

        u.name

        `,

        [

            documentId

        ]

    );

    return rows;

}

/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

export async function updateRole(

    documentId,

    userId,

    role

){

    const { rows } = await pool.query(

        `

        UPDATE document_members

        SET role=$3

        WHERE

        document_id=$1

        AND

        user_id=$2

        RETURNING *

        `,

        [

            documentId,

            userId,

            role

        ]

    );

    return rows[0];

}

/*
|--------------------------------------------------------------------------
| Remove Member
|--------------------------------------------------------------------------
*/

export async function removeMember(

    documentId,

    userId

){

    await pool.query(

        `

        DELETE

        FROM document_members

        WHERE

        document_id=$1

        AND

        user_id=$2

        `,

        [

            documentId,

            userId

        ]

    );

}