import Session from "./Session.js";

class SessionManager {

    constructor() {

        this.sessions = new Map();

    }

    get(documentId) {

        return this.sessions.get(documentId);

    }

    getOrCreate(documentId) {

    let session = this.sessions.get(documentId);

    if (session) {

        return session;

    }

    session = new Session(documentId);

    this.sessions.set(

        documentId,

        session

    );

    console.log(

        "Created session:",

        documentId

    );

    session.initialize();

    return session;

}

    remove(documentId) {

        this.sessions.delete(documentId);

        console.log(
            "Destroyed session:",
            documentId
        );

    }

}

export default new SessionManager();