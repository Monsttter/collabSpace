import * as Y from "yjs";

import repository from "../repositories/DocumentPersistenceRepository.js";

class PostgresPersistence {

    /*
    |--------------------------------------------------------------------------
    | Load Snapshot
    |--------------------------------------------------------------------------
    */

    async load(documentId, ydoc) {

        const snapshot =
            await repository.getSnapshot(documentId);

        if (!snapshot) {

            console.log(
                `No snapshot found for ${documentId}`
            );

            return;

        }

        console.log(
            `Loading ${documentId}`
        );

        Y.applyUpdate(

            ydoc,

            new Uint8Array(snapshot)

        );

        console.log(

            "Loaded:",

            ydoc
                .getXmlFragment("default")
                .toJSON()

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Save Snapshot
    |--------------------------------------------------------------------------
    */

    async save(documentId, ydoc) {

        const snapshot =
            Y.encodeStateAsUpdate(ydoc);

        console.log(

            `Saving ${documentId}`

        );

        console.log(

            "Saving:",

            ydoc
                .getXmlFragment("default")
                .toJSON()

        );

        await repository.saveSnapshot(

            documentId,

            snapshot

        );

    }

}

export default new PostgresPersistence();