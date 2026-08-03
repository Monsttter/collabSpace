import express from "express";

import authenticate from "../middleware/authMiddleware.js";

import validate from "../validators/validate.js";

import {

    shareDocumentSchema,

    updateRoleSchema

} from "../validators/shareValidator.js";

import * as controller from "../controllers/shareController.js";

const router = express.Router();

router.post(
    "/:id/share",
    authenticate,
    validate(shareDocumentSchema),
    controller.shareDocument
);

router.get(
    "/:id/members",
    authenticate,
    controller.getCollaborators
);

router.patch(
    "/:id/members/:userId",
    authenticate,
    validate(updateRoleSchema),
    controller.updateRole
);

router.delete(
    "/:id/members/:userId",
    authenticate,
    controller.removeCollaborator
);

export default router;