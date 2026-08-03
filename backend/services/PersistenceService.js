import * as Y from "yjs";
import repository from "../repositories/DocumentPersistenceRepository.js";

class PersistenceService {

    async loadDocument(documentId, ydoc) {

        const {
            snapshot,
            generation
        } = await repository.getSnapshot(documentId);

        if (snapshot) {

            Y.applyUpdate(
                ydoc,
                new Uint8Array(snapshot)
            );

        }

        const updates =
            await repository.getUpdates(
                documentId,
                generation
            );

        for (const update of updates) {

            Y.applyUpdate(
                ydoc,
                new Uint8Array(update)
            );

        }

        return generation;

    }

    async saveUpdate(
        documentId,
        generation,
        update
    ) {

        await repository.insertUpdate(
            documentId,
            generation,
            update
        );

    }

}

export default new PersistenceService();