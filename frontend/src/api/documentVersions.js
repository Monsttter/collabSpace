import api from "./api";


/*
|--------------------------------------------------------------------------
| Get Version History
|--------------------------------------------------------------------------
*/

export async function fetchVersions(documentId) {

    const result = await api(
        `/documents/${documentId}/versions`,
    );

    return result.data;
}


/*
|--------------------------------------------------------------------------
| Create Version
|--------------------------------------------------------------------------
*/

export async function createVersion(
    documentId,
    description
) {

    const result = await api(
        `/documents/${documentId}/versions`,
        {
            method: "POST",
            body: JSON.stringify({
                description
            })
        }
    );

    return result.data;
}


/*
|--------------------------------------------------------------------------
| Get Specific Version
|--------------------------------------------------------------------------
*/

export async function fetchVersion(
    documentId,
    versionNumber
) {

    const result = await api(
        `/documents/${documentId}/versions/${versionNumber}`
    );

    return result.data;
}


export async function restoreVersion(
    documentId,
    versionNumber,
    createBackup
) {
    // console.log(documentId);
    const result = await api(
        `/documents/${documentId}/versions/${versionNumber}/restore`,
        {
            method: "POST",
            body: JSON.stringify({
                    createBackup,
                }),
        }
    );

    return result.data;
}