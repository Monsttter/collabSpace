import * as versionService
    from "../services/documentVersionService.js";


/*
|--------------------------------------------------------------------------
| Create Version
|--------------------------------------------------------------------------
*/

export async function createVersion(
    req,
    res,
    next
) {

    try {

        const {
            description
        } = req.body;

        if (
            !description ||
            !description.trim()
        ) {

            throw new AppError(
                400,
                "Version description is required"
            );

        }

        const version =
            await versionService.createVersion(
                req.params.id,
                req.user.id,
                description
            );

        return res.status(201).json({

            success: true,

            data: version

        });

    }

    catch (error) {

        next(error);

    }

}


/*
|--------------------------------------------------------------------------
| Get Versions
|--------------------------------------------------------------------------
*/

export async function getVersions(
    req,
    res,
    next
) {

    try {

        const versions =
            await versionService.getVersions(
                req.params.id,
                req.user.id
            );

        return res.json({

            success: true,

            data: versions

        });

    }

    catch (error) {

        next(error);

    }

}


/*
|--------------------------------------------------------------------------
| Get Version
|--------------------------------------------------------------------------
*/

export async function getVersion(
    req,
    res,
    next
) {

    try {

        const version =
            await versionService.getVersion(
                req.params.id,
                req.user.id,
                Number(
                    req.params.versionNumber
                )
            );

        return res.json({

            success: true,

            data: version

        });

    }
    
    catch (error) {
        
        next(error);
        
    }
    
}


/*
|--------------------------------------------------------------------------
| Restore Version
|--------------------------------------------------------------------------
*/

export async function restoreVersion(
    req,
    res,
    next
) {

    try {

        const {
            documentId,
            versionNumber
        } = req.params;

        const {
            createBackup = true
        } = req.body;

        const version =
            await versionService.restoreVersion(
                documentId,
                req.user.id,
                Number(versionNumber),
                createBackup
            );

        return res.json({

            success: true,

            data: version

        });

    } catch (error) {

        next(error);

    }
}