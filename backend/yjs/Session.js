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

    this.eventConnections = new Set();

    this.initialized = false;

    this.initializing = null;

    this.dirty = false;

    this.autoSaveTimer = null;

    this.destroyed = false;

    this.restoring = false;

    this.documentGeneration = 0;

    /*
     * ------------------------------------------------
     * Y.Doc listeners
     * ------------------------------------------------
     */

    this.updateListener = null;

    this.awarenessListener = null;

    this.dirtyListener = null;

    this.listenersAttached = false;
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
    // console.log(`Loading ${this.documentId}`);

    await Persistence.load(
      this.documentId,

      this.doc,
    );

    /*
     * Attach all listeners to the
     * CURRENT Y.Doc.
     */

    this.attachDocumentListeners();

    this.autoSaveTimer = setInterval(async () => {
      try {
        await this.save();
      } catch (error) {
        console.error("Autosave failed:", error);
      }
    }, 30000);

    this.initialized = true;
  }

  /*
   * ------------------------------------------------
   * Document Listeners
   * ------------------------------------------------
   */
  attachDocumentListeners() {
    if (this.listenersAttached) {
      return;
    }

    const doc = this.doc;

    this.updateListener = (update) => {
      this.messageHandler.broadcastUpdate(update);
    };

    doc.on("update", this.updateListener);

    this.awarenessListener = ({ added, updated, removed }) => {
      this.messageHandler.broadcastAwareness([
        ...added,
        ...updated,
        ...removed,
      ]);
    };

    doc.awareness.on("update", this.awarenessListener);

    this.dirtyListener = () => {
      this.dirty = true;
    };

    doc.on("update", this.dirtyListener);

    this.listenersAttached = true;

    // console.log(`Attached Yjs listeners for ${this.documentId}`);
  }

  /*
   * ------------------------------------------------
   * Detach Document Listeners
   * ------------------------------------------------
   */
  detachDocumentListeners() {
    if (!this.listenersAttached) {
      return;
    }

    if (this.updateListener) {
      this.doc.off("update", this.updateListener);
    }

    if (this.dirtyListener) {
      this.doc.off("update", this.dirtyListener);
    }

    if (this.awarenessListener) {
      this.doc.awareness.off("update", this.awarenessListener);
    }

    this.updateListener = null;

    this.dirtyListener = null;

    this.awarenessListener = null;

    this.listenersAttached = false;

    // console.log(`Detached Yjs listeners for ${this.documentId}`);
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

  addCommentConnection(conn) {
    this.commentConnections.add(conn);
  }

  removeCommentConnection(conn) {
    this.commentConnections.delete(conn);
  }

  addEventConnection(conn) {
    this.eventConnections.add(conn);
  }

  removeEventConnection(conn) {
    this.eventConnections.delete(conn);
  }

  /*
   * ------------------------------------------------
   * Total connections
   * ------------------------------------------------
   *
   * IMPORTANT:
   * A session should remain alive while
   * ANY realtime channel is connected.
   */

  get size() {
    return this.connections.size;
  }

  get totalConnections() {
    return (
      this.connections.size +
      this.commentConnections.size +
      this.eventConnections.size
    );
  }

  get isRestoring() {
    return this.restoring;
  }

  /*
   * ------------------------------------------------
   * Snapshot
   * ------------------------------------------------
   */

  getSnapshot() {
    return Y.encodeStateAsUpdate(this.doc);
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

      // console.log(`Saving ${this.documentId}`);

      const updatedAt = await Persistence.save(
          this.documentId,
          this.doc,
      );

      this.dirty = false;

      this.broadcastEvent({
          type: "document-updated",
          documentId: this.documentId,
          updatedAt,
      });
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

    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);

      this.autoSaveTimer = null;
    }

    /*
     * Save latest state BEFORE
     * destroying the document.
     */

    try {
      await this.save();
    } catch (error) {
      console.error("Final session save failed:", error);
    }

    /*
     * Remove Y.Doc listeners.
     */
    this.detachDocumentListeners();

    /*
     * Destroy awareness.
     */

    if (this.doc?.awareness) {
      this.doc.awareness.destroy();
    }

    /*
     * Destroy Y.Doc.
     */

    if (this.doc) {
      this.doc.destroy();
    }

    this.connections.clear();

    this.commentConnections.clear();

    this.eventConnections.clear();

    // console.log(`Session destroyed: ${this.documentId}`);
  }

  /*
   * ------------------------------------------------
   * Comment events
   * ------------------------------------------------
   */

  broadcastCommentEvent(event) {
    const message = JSON.stringify({
      type: "comment",

      event,
    });

    for (const conn of this.commentConnections) {
      if (conn.readyState === 1) {
        conn.send(message);
      }
    }
  }

  disconnectUser(userId) {
    for (const conn of this.connections) {
      if (String(conn.user?.id) === String(userId)) {
        conn.close(1008, "Access revoked");
      }
    }
    for (const conn of this.commentConnections) {
      if (String(conn.user?.id) === String(userId)) {
        conn.close(1008, "Access revoked");
      }
    }
    for (const conn of this.eventConnections) {
      if (String(conn.user?.id) === String(userId)) {
        conn.close(1008, "Access revoked");
      }
    }
  }

  broadcastCollaboratorEvent(event) {
    const message = JSON.stringify({
      type: "collaborator",
      event,
    });

    for (const conn of this.commentConnections) {
      if (conn.readyState === 1) {
        conn.send(message);
      }
    }
  }

  updateUserRole(userId, newRole) {
    for (const conn of this.connections) {
      if (String(conn.user?.id) === String(userId)) {
        conn.role = newRole;
      }
    }

    for (const conn of this.commentConnections) {
      if (String(conn.user?.id) === String(userId)) {
        conn.role = newRole;
      }
    }
  }

  getXmlFragment() {
    return this.doc.getXmlFragment("default");
  }

  async restoreSnapshot(snapshot) {
    if (!snapshot) {
      throw new Error("Version snapshot is missing");
    }

    /*
     * Apply the snapshot to the existing live Y.Doc.
     *
     * Persistence should return the snapshot as a Uint8Array
     * or Buffer containing a Yjs encoded state.
     */
    const update = new Uint8Array(snapshot);

    Y.applyUpdate(this.doc, update, "version-restore");

    this.dirty = true;
  }

  broadcastEvent(event) {
    const message = JSON.stringify(event);

    for (const conn of this.eventConnections) {
      if (conn.readyState === 1) {
        conn.send(message);
      }
    }
  }

  /*
   * ------------------------------------------------
   * Replace Y.Doc
   * ------------------------------------------------
   */

  async replaceDocument(snapshot) {
    // console.log(`Replacing Y.Doc for ${this.documentId}`);

    if (!snapshot) {
      throw new Error("Version snapshot is missing");
    }

    /*
     * Stop listening to the old Y.Doc.
     */
    this.detachDocumentListeners();

    /*
     * ------------------------------------------------
     * Destroy OLD awareness
     * ------------------------------------------------
     */

    if (this.doc?.awareness) {
      this.doc.awareness.destroy();
    }

    const oldDoc = this.doc;

    /*
     * Create completely fresh Y.Doc.
     */
    const newDoc = new WSSharedDoc(this.documentId);

    /*
     * Restore exact historical state.
     */
    Y.applyUpdate(newDoc, new Uint8Array(snapshot));

    /*
     * Replace session document.
     */
    this.doc = newDoc;

    /*
     * MessageHandler must point at the
     * new document.
     */
    this.messageHandler = new MessageHandler(this);

    /*
     * Start listening to the new document.
     */
    this.attachDocumentListeners();

    /*
     * Old Y.Doc is no longer used.
     */
    oldDoc.destroy();

    /*
     * Persistence will save the restored state.
     */
    this.dirty = true;

    // console.log(`Y.Doc replaced successfully for ${this.documentId}`);
  }

closeYjsConnections(
    code = 1000,
    reason = "Document restored"
) {

    for (
        const conn
        of this.connections
    ) {

        if (
            conn.readyState === 1
        ) {

            conn.close(
                code,
                reason
            );

        }

    }
}

  async restoreDocument(
    snapshot,
    versionNumber
) {

    if (this.restoring) {

        throw new Error(
            "Document restoration already in progress"
        );

    }

    this.restoring = true;
    
    try {
      
        this.documentGeneration++;

        await this.replaceDocument(
            snapshot
        );

        /*
         * ------------------------------------------
         * 6. Tell frontend
         * ------------------------------------------
         */

        this.broadcastEvent({

            type:
                "document-restored",

            documentId:
                this.documentId,

            versionNumber

        });

        this.closeYjsConnections(
            1000,
            "Document restored"
        );

    } finally {

        this.restoring = false;

    }
}
}
