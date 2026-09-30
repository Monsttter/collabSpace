export function scrollToComment(editor, anchor, head) {

    if (!editor) {
        return;
    }

    const from = Math.min(anchor, head);
    // const to = Math.max(anchor, head);

    const start =
        editor.view.domAtPos(from);

    // const end =
    //     editor.view.domAtPos(to);

    const startNode =
        start.node.nodeType === Node.TEXT_NODE
            ? start.node.parentElement
            : start.node;

    // const endNode =
    //     end.node.nodeType === Node.TEXT_NODE
    //         ? end.node.parentElement
    //         : end.node;


    /*
     * Prefer the actual element containing
     * the beginning of the comment.
     */
    const target =
        startNode?.closest?.(
            "p, h1, h2, h3, h4, h5, h6, li, blockquote"
        ) ||
        startNode;


    if (!target) {
        return;
    }


    target.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });

}