import * as Y from "yjs";

import {
    ySyncPluginKey,
    absolutePositionToRelativePosition,
    relativePositionToAbsolutePosition,
} from "@tiptap/y-tiptap";


export function createCommentPositions(
    editor,
    ydoc,
    from,
    to
) {
    const syncState =
        ySyncPluginKey.getState(editor.state);

    if (!syncState?.binding) {
        throw new Error(
            "Yjs binding not available"
        );
    }

    const mapping =
        syncState.binding.mapping;

    const yXmlFragment =
        ydoc.getXmlFragment("default");

    const anchorRelative =
        absolutePositionToRelativePosition(
            from,
            yXmlFragment,
            mapping
        );

    const headRelative =
        absolutePositionToRelativePosition(
            to,
            yXmlFragment,
            mapping
        );

    return {
        anchorRelative:
        // Buffer.from(
            Y.encodeRelativePosition(
                anchorRelative
            ).toBase64(),
        // ).toString("base64"),

        headRelative: 
        // Buffer.from(
            Y.encodeRelativePosition(
                headRelative
            ).toBase64(),
        // ).toString("base64"),
    };
}


export function resolveCommentPositions(
    editor,
    ydoc,
    anchorRelative,
    headRelative
) {
    // console.log(anchorRelative,headRelative)
    const syncState =
        ySyncPluginKey.getState(editor.state);

    if (!syncState?.binding) {
        throw new Error(
            "Yjs binding not available"
        );
    }

    const mapping =
        syncState.binding.mapping;

    const yXmlFragment =
        ydoc.getXmlFragment("default");


    const anchor =
        Y.decodeRelativePosition(
            Uint8Array.fromBase64(
                // Buffer.from(
                    anchorRelative
                    // "base64"
                // )
            )
        );


    const head =
        Y.decodeRelativePosition(
            Uint8Array.fromBase64(
                // Buffer.from(
                    headRelative
                    // "base64"
                // )
            )
        );



    const anchorAbsolute =
        relativePositionToAbsolutePosition(
            ydoc,
            yXmlFragment,
            anchor,
            mapping
        );


    const headAbsolute =
        relativePositionToAbsolutePosition(
            ydoc,
            yXmlFragment,
            head,
            mapping
        );
    // console.log(anchorAbsolute, headAbsolute);


    if (
        anchorAbsolute == null ||
        headAbsolute == null
    ) {
        return null;
    }


    return {
        anchor: anchorAbsolute,
        head: headAbsolute,
    };
}