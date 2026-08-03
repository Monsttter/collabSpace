import 'dotenv/config';

import http from "http";

import { startRealtimeServer } from "./yjs/RealtimeServer.js";

const server = http.createServer();

startRealtimeServer(server);

server.listen(

    process.env.PORT || 1234,

    () =>

        console.log(

            "Realtime server started"

        )

);