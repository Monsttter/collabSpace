import * as repository from "../repositories/documentRepository.js";

import AppError from "../utils/AppError.js";

export async function requireRole(

    documentId,

    userId,

    allowedRoles

){

    const member = await repository.getMember(

        documentId,

        userId

    );

    if(!member)

        throw new AppError(

            403,

            "Access denied"

        );

    if(

        !allowedRoles.includes(member.role)

    )

        throw new AppError(

            403,

            "Permission denied"

        );

    return member;

}