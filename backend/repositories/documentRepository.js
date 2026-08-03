import pool from "../config/db.js";

/**
 * Creates a new document.
 */
export async function createDocument(client, document) {
    const query = `
        INSERT INTO documents
        (
            id,
            title,
            owner_id
        )
        VALUES
        ($1,$2,$3)
        RETURNING *;
    `;

    const { rows } = await client.query(query, [
        document.id,
        document.title,
        document.ownerId
    ]);

    return rows[0];
}

/**
 * Adds a member to a document.
 */
export async function addMember(
    client,
    documentId,
    userId,
    role,
    invitedBy
) {
    const query = `
        INSERT INTO document_members
        (
            document_id,
            user_id,
            role,
            invited_by
        )
        VALUES
        ($1,$2,$3,$4)
        RETURNING *;
    `;

    const { rows } = await client.query(query, [
        documentId,
        userId,
        role,
        invitedBy,
    ]);

    return rows[0];
}

/**
 * Find document by id.
 */
export async function findById(documentId){

    const { rows } = await pool.query(

        `
        SELECT *

        FROM documents

        WHERE

            id=$1
        `,

        [documentId]

    );

    return rows[0];

}

/**
 * Returns every document user has access to.
 */
export async function findDocumentsByUser(userId) {

    const query = `
        SELECT

            d.id,
            d.title,
            d.owner_id,
            d.created_at,
            d.updated_at,

            dm.role,
            dm.favorite,
            dm.pinned

        FROM documents d

        INNER JOIN document_members dm

        ON dm.document_id=d.id

        WHERE

            dm.user_id=$1

        ORDER BY

            dm.pinned DESC,

            d.updated_at DESC;
    `;

    const { rows } = await pool.query(query,[userId]);

    return rows;

}

/**
 * Returns member row.
 */
export async function getMember(documentId,userId){

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

/**
 * Update title.
 */
export async function updateTitle(documentId,title){

    const { rows } = await pool.query(

        `
        UPDATE documents

        SET

            title=$2,

            updated_at=NOW()

        WHERE

            id=$1

        RETURNING *
        `,

        [

            documentId,

            title

        ]

    );

    return rows[0];

}

/**
 * Soft delete.
 */
// export async function deleteDocument(documentId){

//     await pool.query(

//         `
//         UPDATE documents

//         SET

//             is_deleted=true,

//             updated_at=NOW()

//         WHERE

//             id=$1
//         `,

//         [documentId]

//     );

// }

// export async function deleteDocument(id){

//     await pool.query(

//         `

//         DELETE FROM documents

//         WHERE id=$1

//         `,

//         [id]

//     );

// }


/**
 * Favorite.
 */
// export async function toggleFavorite(documentId,userId){

//     const { rows } = await pool.query(

//         `
//         UPDATE document_members

//         SET

//             favorite=NOT favorite

//         WHERE

//             document_id=$1

//         AND

//             user_id=$2

//         RETURNING favorite
//         `,

//         [

//             documentId,

//             userId

//         ]

//     );

//     return rows[0];

// }

/**
 * Update last opened timestamp.
 */
// export async function updateLastOpened(documentId){

//     await pool.query(

//         `
//         UPDATE documents

//         SET

//             last_opened_at=NOW()

//         WHERE

//             id=$1
//         `,

//         [documentId]

//     );

// }

// export async function hasAccess(

//     documentId,

//     userId

// ){

//     const { rows } =

//         await pool.query(

//         `

//         SELECT role

//         FROM document_members

//         WHERE

//         document_id=$1

//         AND

//         user_id=$2

//         `,

//         [

//             documentId,

//             userId

//         ]

//     );

//     return rows[0];

// }