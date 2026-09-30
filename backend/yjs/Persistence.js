import * as Y from "yjs";
import repository from "../repositories/DocumentPersistenceRepository.js";

class Persistence {

    /*
    |--------------------------------------------------------------------------
    | Load Snapshot
    |--------------------------------------------------------------------------
    */

    async load(documentId, doc) {

        const snapshot =
            await repository.getSnapshot(documentId);

        if (!snapshot) {

            console.log(
                `No snapshot found for ${documentId}`
            );

            return;
        }

        // console.log(
        //     `Loading snapshot (${snapshot.length} bytes)`
        // );

        Y.applyUpdate(

            doc,

            new Uint8Array(snapshot)

        );

        // console.log(

        //     "Loaded:",

        //     doc
        //         .getXmlFragment("default")
        //         .toJSON()

        // );

    }

    /*
    |--------------------------------------------------------------------------
    | Save Snapshot
    |--------------------------------------------------------------------------
    */

    async save(documentId, doc) {
        const snapshot =
            Y.encodeStateAsUpdate(doc);

        // console.log(
        //     `Saving snapshot (${snapshot.length} bytes)`
        // );

        const updatedAt =
            await repository.saveSnapshot(
                documentId,
                snapshot
            );

        return updatedAt;
    }

}

export default new Persistence();