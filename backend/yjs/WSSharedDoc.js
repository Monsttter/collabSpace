import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";

export default class WSSharedDoc extends Y.Doc {

    constructor(name) {

        super();

        this.name = name;

        this.connections = new Set();

        this.awareness =
            new awarenessProtocol.Awareness(this);

        this.awareness.setLocalState(null);

    }

}