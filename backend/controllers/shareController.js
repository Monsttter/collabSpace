import * as shareService from "../services/shareService.js";

export async function shareDocument(req,res,next){

    try{

        const collaborator =

            await shareService.shareDocument(

                req.params.id,

                req.user.id,

                req.body.email,

                req.body.role

            );

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

        await shareService.removeCollaborator(

            req.params.id,

            req.user.id,

            req.params.userId

        );

        res.json({

            success:true,

            message:"Collaborator removed."

        });

    }

    catch(error){

        next(error);

    }

}