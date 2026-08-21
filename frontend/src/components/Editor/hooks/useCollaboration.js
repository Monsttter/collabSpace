import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import useDocumentEventSocket from "./useDocumentEventSocket";
import useCommentSocket from "./useCommentSocket";
import { versionCreatedRealtime } from "../../../store/versions/versionSlice";

const COLORS = [
  "#2563EB",
  "#16A34A",
  "#DC2626",
  "#9333EA",
  "#EA580C",
  "#0891B2",
];

function getUserColor(id) {
  let hash = 0;

  for (const ch of id) {
    hash += ch.charCodeAt(0);
  }

  return COLORS[hash % COLORS.length];
}

class RevocationWebSocket extends WebSocket {
  constructor(url, protocols) {
    super(url, protocols);

    this.addEventListener("close", (event) => {
      if (event.code === 1008) {
        console.log("WebSocket access revoked");

        window.dispatchEvent(new CustomEvent("document-access-revoked"));
      }
    });
  }
}

export default function useCollaboration() {
  const { id: documentId } = useParams();

  const user = useSelector((state) => state.auth.user);

  const ydocRef = useRef(null);

  const providerRef = useRef(null);

  const [ready, setReady] = useState(false);

  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const [connectionStatus, setConnectionStatus] = useState("connecting");

  const [accessRevoked, setAccessRevoked] = useState(false);

  const [generation, setGeneration] = useState(0);

  const dispatch = useDispatch();

  useCommentSocket(documentId);

  useEffect(() => {
    if (!documentId) return;

    console.log("Create collaboration");

    const ydoc = new Y.Doc();

    const token = localStorage.getItem("token");

    const provider = new WebsocketProvider(
      process.env.REACT_APP_WEBSOCKET_URL,
      documentId,
      ydoc,
      {
        params: {
          token,
        },
        WebSocketPolyfill: RevocationWebSocket,
      },
    );

    ydocRef.current = ydoc;
    providerRef.current = provider;

    setReady(true);

    return () => {
      console.log("Destroy collaboration");

      provider.destroy();

      ydoc.destroy();

      providerRef.current = null;
      ydocRef.current = null;

      setReady(false);
    };
  }, [documentId, generation]);

  const recreateCollaboration =
    useCallback(() => {

        setGeneration(
            value => value + 1
        );

    }, []);

  const handleDocumentEvent =
    useCallback(
        event => {
            if (
                event.type ===
                "document-restored"
            ) {
                recreateCollaboration();
            }
            if (
                event.type ===
                "version-created"
            ) {

                dispatch(
                    versionCreatedRealtime(
                        event.version
                    )
                );

            }
        },
        [
            recreateCollaboration
        ]
    );
    useDocumentEventSocket(
    documentId,
    handleDocumentEvent);

  useEffect(() => {
    if (!ready) return;

    const handleAccessRevoked = () => {
      console.log("Document access revoked");

      const provider = providerRef.current;

      if (provider) {
        /*
         * Important:
         *
         * disconnect() sets
         * shouldConnect = false.
         *
         * Therefore y-websocket
         * will NOT reconnect.
         */
        provider.disconnect();
      }

      setAccessRevoked(true);
    };

    window.addEventListener("document-access-revoked", handleAccessRevoked);

    return () => {
      window.removeEventListener(
        "document-access-revoked",
        handleAccessRevoked,
      );
    };
  }, [ready, navigate]);

  useEffect(() => {
    if (!ready) return;

    const provider = providerRef.current;

    const statusHandler = ({ status }) => {
      setConnectionStatus(status);
    };

    provider.on("status", statusHandler);

    return () => {
      provider.off("status", statusHandler);
    };
  }, [ready, generation]);

  useEffect(() => {
    if (!ready || !user) return;

    providerRef.current.awareness.setLocalStateField("user", {
      id: user.id,

      name: user.username,

      color: getUserColor(user.id),
    });
  }, [ready, user, generation]);

  useEffect(() => {
    if (!ready) return;

    const awareness = providerRef.current.awareness;

    const updateUsers = () => {
      const online = [];

      awareness.getStates().forEach((state) => {
        if (state.user) {
          online.push(state.user);
        }
      });

      setUsers(online);
    };

    awareness.on("change", updateUsers);

    updateUsers();

    return () => {
      awareness.off("change", updateUsers);
    };
  }, [ready, generation]);

  return {
    ready,

    ydoc: ydocRef.current,

    provider: providerRef.current,

    users,

    connectionStatus,

    accessRevoked
  };
}
