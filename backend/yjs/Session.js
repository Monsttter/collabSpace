import WSSharedDoc from "./WSSharedDoc.js";
import MessageHandler from "./MessageHandler.js";
import Persistence from "./Persistence.js";
import * as Y from "yjs";

export default class Session {
  constructor(documentId) {
    this.documentId = documentId;

    this.doc = new WSSharedDoc(documentId);

    this.messageHandler = new MessageHandler(this);

    this.connections = new Set();

    // Connections used only for
    // realtime comments/replies.
    this.commentConnections = new Set();

    this.initialized = false;

    this.initializing = null;

    this.dirty = false;

    this.autoSaveTimer = null;

    this.destroyed = false;
  }

  /*
    |--------------------------------------------------------------------------
    | Initialize
    |--------------------------------------------------------------------------
    */

  async initialize() {
    if (this.initialized) {
      return;
    }

    if (this.initializing) {
      return this.initializing;
    }

    this.initializing = this.#initialize();

    return this.initializing;
  }

  async #initialize() {
    console.log(`Loading ${this.documentId}`);

    await Persistence.load(
      this.documentId,

      this.doc,
    );

    this.doc.on(
      "update",

      () => {
        this.dirty = true;
      },
    );

    this.autoSaveTimer = setInterval(
      async () => {
        await this.save();
      },

      30000,
    );

    this.initialized = true;
  }

  /*
    |--------------------------------------------------------------------------
    | Connections
    |--------------------------------------------------------------------------
    */

  addConnection(conn) {
    this.connections.add(conn);
  }

  removeConnection(conn) {
    this.connections.delete(conn);
  }

  get size() {
    return this.connections.size;
  }

  /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

  async save() {
    if (!this.dirty) {
      return;
    }

    console.log(`Saving ${this.documentId}`);

    await Persistence.save(
      this.documentId,

      this.doc,
    );

    this.dirty = false;
  }

  /*
    |--------------------------------------------------------------------------
    | Destroy
    |--------------------------------------------------------------------------
    */

  async destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    clearInterval(this.autoSaveTimer);

    await this.save();

    this.doc.destroy();
  }

  addCommentConnection(conn) {

    this.commentConnections.add(conn);

}


removeCommentConnection(conn) {

    this.commentConnections.delete(conn);

}


broadcastCommentEvent(event) {

    const message = JSON.stringify({

        type: "comment",

        event,

    });


    for (
        const conn
        of this.commentConnections
    ) {

        if (conn.readyState === 1) {

            conn.send(message);

        }

    }

}
}
