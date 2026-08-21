import express from "express";

import authenticate
    from "../middleware/authMiddleware.js";

import * as controller
    from "../controllers/documentVersionController.js";


const router = express.Router();


/*
|--------------------------------------------------------------------------
| Create Version
|--------------------------------------------------------------------------
*/

router.post(
    "/:id/versions",
    authenticate,
    controller.createVersion
);


/*
|--------------------------------------------------------------------------
| Get Version History
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/versions",
    authenticate,
    controller.getVersions
);


/*
|--------------------------------------------------------------------------
| Get Specific Version
|--------------------------------------------------------------------------
*/

router.get(
    "/:id/versions/:versionNumber",
    authenticate,
    controller.getVersion
);

/*
|--------------------------------------------------------------------------
| Restore Specific Version
|--------------------------------------------------------------------------
*/
router.post(
    "/:documentId/versions/:versionNumber/restore",
    authenticate,
    controller.restoreVersion
);


export default router;