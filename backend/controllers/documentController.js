import * as documentService from "../services/documentService.js";

/*
|--------------------------------------------------------------------------
| Create Document
|--------------------------------------------------------------------------
*/

export async function createDocument(req, res, next) {

    try {

        const { title } = req.body;

        const document = await documentService.createDocument(

            title,

            req.user.id

        );

        return res.status(201).json({

            success: true,

            data: document

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get User Documents
|--------------------------------------------------------------------------
*/

export async function getDocuments(req, res, next) {

    try {

        const documents = await documentService.getDocuments(

            req.user.id

        );

        return res.json({

            success: true,

            data: documents

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Get Single Document
|--------------------------------------------------------------------------
*/

export async function getDocument(req, res, next) {

    try {

        const document = await documentService.getDocument(

            req.params.id,

            req.user.id

        );

        return res.json({

            success: true,

            data: document

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Rename Document
|--------------------------------------------------------------------------
*/

export async function renameDocument(req, res, next) {

    try {

        const { title } = req.body;

        const document = await documentService.renameDocument(

            req.params.id,

            title,

            req.user.id

        );

        return res.json({

            success: true,

            data: document

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Toggle Favorite
|--------------------------------------------------------------------------
*/

export async function toggleFavorite(req, res, next) {

    try {

        const favorite = await documentService.toggleFavorite(

            req.params.id,

            req.user.id

        );

        return res.json({

            success: true,

            data: favorite

        });

    }

    catch (error) {

        next(error);

    }

}

/*
|--------------------------------------------------------------------------
| Delete Document
|--------------------------------------------------------------------------
*/

export async function deleteDocument(req, res, next) {

    try {

        await documentService.deleteDocument(

            req.params.id,

            req.user.id

        );

        return res.json({

            success: true,

            message: "Document deleted successfully"

        });

    }

    catch (error) {

        next(error);

    }

}