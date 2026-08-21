import * as shareService from "../services/shareService.js";
import SessionManager from "../yjs/SessionManager.js";

export async function shareDocument(req,res,next){

    try{

        const collaborator =

            await shareService.shareDocument(

                req.params.id,

                req.user.id,

                req.body.email,

                req.body.role

            );

        const session =
            SessionManager.get(req.params.id);

        if (session) {

            session.broadcastCollaboratorEvent({

                action: "created",

                data: collaborator

            });

        }

        res.status(201).json({

            success:true,

            data:collaborator

        });

    }

    catch(error){

        next(error);

    }

}

export async function getCollaborators(req,res,next){

    try{

        const collaborators=

            await shareService.getCollaborators(

                req.params.id,

                req.user.id

            );

        res.json({

            success:true,

            data:collaborators

        });

    }

    catch(error){

        next(error);

    }

}

export async function updateRole(req,res,next){

    try{

        const collaborator=

            await shareService.updateRole(

                req.params.id,

                req.user.id,

                req.params.userId,

                req.body.role

            );

            const session =
            SessionManager.get(req.params.id);

            if (session) {

                session.updateUserRole(
                    req.params.userId,
                    collaborator.role
                );

                session.broadcastCollaboratorEvent({
                    action: "role_updated",
                    data: collaborator
                });

            }


        res.json({

            success:true,

            data:collaborator

        });

    }

    catch(error){

        next(error);

    }

}

export async function removeCollaborator(req,res,next){

    try{

        const documentId = req.params.id;
        const userId = req.params.userId;

        await shareService.removeCollaborator(
            documentId,
            req.user.id,
            userId
        );

        const session =
            SessionManager.get(documentId);

        if (session) {

            session.disconnectUser(userId);

        }

        session.broadcastCollaboratorEvent({
    action: "removed",
    data: {
        user_id: req.params.userId
    }
});

        res.json({
            success: true,
            message: "Collaborator removed.",
        });

    }

    catch(error){

        next(error);

    }

}