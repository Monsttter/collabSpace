import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Extension } from "@tiptap/core";
// import { Plugin } from "prosemirror-state";
// import { Decoration, DecorationSet } from "prosemirror-view";

const remoteCursorKey = new PluginKey("remoteCursor");

function createDecorations(doc, provider) {

    if (!provider) {

        return DecorationSet.empty;

    }

    const decorations = [];

    const awareness = provider.awareness;

    awareness.getStates().forEach((remoteState, clientID) => {

        if (clientID === awareness.clientID) return;
        if (!remoteState.user) return;
        if (!remoteState.cursor) return;

        const { anchor, head } = remoteState.cursor;
        const color = remoteState.user.color;

        const cursor = document.createElement("span");
        cursor.className = "remote-caret";
        cursor.style.borderLeft = `2px solid ${color}`;

        const label = document.createElement("div");
        label.className = "remote-label";
        label.style.background = color;
        label.textContent = remoteState.user.name;

        cursor.appendChild(label);

        decorations.push(
            Decoration.widget(head, cursor, {
                side: 1,
            })
        );

        if (anchor !== head) {

            decorations.push(
                Decoration.inline(
                    Math.min(anchor, head),
                    Math.max(anchor, head),
                    {
                        style: `background:${color}33;`,
                    }
                )
            );

        }

    });

    return DecorationSet.create(doc, decorations);

}




// console.log(
//     "RemoteCursor provider:",
//     this.options.provider
// );
export const RemoteCursor = Extension.create({
    
    name: "remoteCursor",

    addOptions() {

        return {

            provider: null,

        };

    },

    addProseMirrorPlugins() {

        console.log(
    "RemoteCursor provider:",
    this.options.provider.awareness.clientID
);

        const provider = this.options.provider;

        return [

                new Plugin({

    key: remoteCursorKey,

    state: {

        init(_, state) {

            return createDecorations(
                state.doc,
                provider
            );

        },

        apply(transaction, decorationSet) {

            if (
                transaction.docChanged ||
                transaction.getMeta(remoteCursorKey)
            ) {

                return createDecorations(
                    transaction.doc,
                    provider
                );

            }

            return decorationSet.map(
                transaction.mapping,
                transaction.doc
            );

        },

    },

    props: {

        decorations(state) {

            return remoteCursorKey.getState(state);

        },

    },

    view(editorView) {

    const awareness = provider.awareness;

    const update = () => {

        editorView.dispatch(

            editorView.state.tr.setMeta(

                remoteCursorKey,

                true

            )

        );

    };

    awareness.on("change", update);

    return {

        destroy() {

            awareness.off("change", update);

        },

    };

}
})

        ];

    },

});