import * as memberRepository from "../repositories/memberRepository.js";
import * as userRepository from "../repositories/userRepository.js";

import { requireRole } from "./permissionService.js";

import { Roles } from "../utils/roles.js";

import AppError from "../utils/AppError.js";


export async function shareDocument(

    documentId,

    ownerId,

    email,

    role

){

    await requireRole(

        documentId,

        ownerId,

        [

            Roles.OWNER,

            Roles.EDITOR

        ]

    );

    const user =

        await userRepository.findByEmail(email);

    if(!user)

        throw new AppError(

            404,

            "User not found."

        );

    const alreadyMember =

        await memberRepository.isMember(

            documentId,

            user.id

        );

    if(alreadyMember)

        throw new AppError(

            409,

            "User already has access."

        );

    await memberRepository.addMember(

        documentId,

        user.id,

        role,

        ownerId

    );

    return {

        ...user,

        role

    };

}


export async function getCollaborators(

    documentId,

    userId

){

    await requireRole(

        documentId,

        userId,

        [

            Roles.OWNER,

            Roles.EDITOR,

            Roles.COMMENTER,

            Roles.VIEWER

        ]

    );

    return await memberRepository.getMembers(

        documentId

    );

}


export async function updateRole(

    documentId,

    ownerId,

    memberId,

    role

){

    await requireRole(

        documentId,

        ownerId,

        [

            Roles.OWNER

        ]

    );

    return await memberRepository.updateRole(

        documentId,

        memberId,

        role

    );

}

export async function removeCollaborator(

    documentId,

    ownerId,

    memberId

){

    await requireRole(

        documentId,

        ownerId,

        [

            Roles.OWNER

        ]

    );

    await memberRepository.removeMember(

        documentId,

        memberId

    );

}