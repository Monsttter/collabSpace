import { randomUUID } from "crypto";

import pool from "../config/db.js";

import * as repository from "../repositories/documentRepository.js";
import { Roles } from "../utils/roles.js";
import AppError from "../utils/AppError.js";
import { requireRole } from "./permissionService.js";

/*
|--------------------------------------------------------------------------
| Create Document
|--------------------------------------------------------------------------
*/

export async function createDocument(title, ownerId) {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const document = await repository.createDocument(client, {

            id: randomUUID(),

            title,

            ownerId

        });

        await repository.addMember(

            client,

            document.id,

            ownerId,

            Roles.OWNER,

            ownerId

        );

        await client.query("COMMIT");

        return document;

    }

    catch (error) {

        await client.query("ROLLBACK");

        throw error;

    }

    finally {

        client.release();

    }

}

/*
|--------------------------------------------------------------------------
| Get User Documents
|--------------------------------------------------------------------------
*/

export async function getDocuments(userId) {

    return await repository.findDocumentsByUser(userId);

}

/*
|--------------------------------------------------------------------------
| Get Document
|--------------------------------------------------------------------------
*/

export async function getDocument(documentId, userId) {

    const document = await repository.findById(documentId);

    if (!document)
        throw new AppError(404, "Document not found");

    const member = await repository.getMember(

        documentId,

        userId

    );

    if (!member)
        throw new AppError(403, "Access denied");

    return {

        ...document,

        role: member.role,

        favorite: member.favorite,

        pinned: member.pinned

    };

}

/*
|--------------------------------------------------------------------------
| Rename Document
|--------------------------------------------------------------------------
*/

export async function renameDocument(

    documentId,

    title,

    userId

) {

    await requireRole(

        documentId,

        userId,

        [Roles.OWNER, Roles.EDITOR]

    );

    return await repository.updateTitle(

        documentId,

        title

    );

}

/*
|--------------------------------------------------------------------------
| Toggle Favorite
|--------------------------------------------------------------------------
*/

export async function toggleFavorite(

    documentId,

    userId

) {

    const member = await repository.getMember(

        documentId,

        userId

    );

    if (!member)
        throw new AppError(403, "Access denied");

    return await repository.toggleFavorite(

        documentId,

        userId

    );

}

/*
|--------------------------------------------------------------------------
| Delete Document
|--------------------------------------------------------------------------
*/

export async function deleteDocument(

    documentId,

    userId

) {

    const member = await repository.getMember(

        documentId,

        userId

    );

    if (!member)
        throw new AppError(403, "Access denied");

    if (member.role !== Roles.OWNER)

        throw new AppError(

            403,

            "Only owner can delete."

        );

    await repository.deleteDocument(documentId);

}