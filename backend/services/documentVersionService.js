import * as versionRepository
    from "../repositories/documentVersionRepository.js";

import * as documentRepository
    from "../repositories/documentRepository.js";

import SessionManager
    from "../yjs/SessionManager.js";

import { Roles }
    from "../utils/roles.js";

import AppError
    from "../utils/AppError.js";

import { requireRole }
    from "./permissionService.js";


/*
|--------------------------------------------------------------------------
| Create Version
|--------------------------------------------------------------------------
*/

export async function createVersion(
    documentId,
    userId,
    description = null
) {

    /*
     * Only owner/editor can create
     * a historical version.
     */
    await requireRole(
        documentId,
        userId,
        [
            Roles.OWNER,
            Roles.EDITOR
        ]
    );


    /*
     * The document must currently have
     * an active Yjs session.
     */
    const session =
        SessionManager.get(documentId);


    if (!session) {

        throw new AppError(
            404,
            "Document session not found"
        );

    }


    /*
     * Make sure the Yjs document has
     * finished loading from persistence.
     */
    await session.initialize();


    /*
     * Create a complete Yjs snapshot.
     *
     * This is NOT HTML.
     *
     * It contains the Yjs document state.
     */
    const snapshot =
    session.getSnapshot();


    /*
     * Store the snapshot.
     */
    const version =
        await versionRepository.createVersion({

            documentId,

            createdBy: userId,

            snapshot,

            description:
                description?.trim() || null

        });
    
        session.broadcastEvent({

        type: "version-created",

        documentId,

        version: version

    });


    return version;
}


/*
|--------------------------------------------------------------------------
| Get Versions
|--------------------------------------------------------------------------
*/

export async function getVersions(
    documentId,
    userId
) {

    /*
     * First make sure the user belongs
     * to the document.
     *
     * We don't require editor permissions
     * here because viewers should be able
     * to see version history.
     */
    const member =
        await documentRepository.getMember(
            documentId,
            userId
        );


    if (!member) {

        throw new AppError(
            403,
            "Access denied"
        );

    }


    return await versionRepository.getVersions(
        documentId
    );
}


/*
|--------------------------------------------------------------------------
| Get One Version
|--------------------------------------------------------------------------
*/

export async function getVersion(
    documentId,
    userId,
    versionNumber
) {

    /*
     * Version history is readable by
     * every document member.
     */
    const member =
        await documentRepository.getMember(
            documentId,
            userId
        );


    if (!member) {

        throw new AppError(
            403,
            "Access denied"
        );

    }


    const version =
        await versionRepository.getVersionByNumber(
            documentId,
            versionNumber
        );


    if (!version) {

        throw new AppError(
            404,
            "Version not found"
        );

    }


    return version;
}


/*
|--------------------------------------------------------------------------
| Restore Version
|--------------------------------------------------------------------------
*/

export async function restoreVersion(
    documentId,
    userId,
    versionNumber,
    createBackup = true
) {

    /*
     * Only owner/editor can restore.
     */
    await requireRole(
        documentId,
        userId,
        [
            Roles.OWNER,
            Roles.EDITOR
        ]
    );

    /*
     * The live session must exist.
     */
    const session =
        SessionManager.get(
            documentId
        );

    if (!session) {

        throw new AppError(
            404,
            "Document session not found"
        );

    }

    await session.initialize();

    /*
     * Get requested historical version.
     */
    const version =
        await versionRepository.getVersionByNumber(
            documentId,
            versionNumber
        );

    if (!version) {

        throw new AppError(
            404,
            "Version not found"
        );

    }

    if (createBackup) {

        await createVersion(
            documentId,
            userId,
            `Before restoring Version ${versionNumber}`
        );

    }

    /*
     * Restore through Session.
     *
     * Session handles:
     *
     * - old listener cleanup
     * - new Y.Doc
     * - new MessageHandler
     * - new listeners
     * - document generation
     * - frontend notification
     * - old connection shutdown
     */

    await session.restoreDocument(
        version.snapshot,
        versionNumber
    );

    return version;
}