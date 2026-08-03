import {
    MenuItem,
    Select,
} from "@mui/material";

export default function HeadingSelect({ editor }) {
    if (!editor) return null;

    let value = "paragraph";

    if (editor.isActive("heading", { level: 1 }))
        value = "h1";

    if (editor.isActive("heading", { level: 2 }))
        value = "h2";

    if (editor.isActive("heading", { level: 3 }))
        value = "h3";

    const handleChange = (e) => {
        const val = e.target.value;

        if (val === "paragraph") {
            editor.chain().focus().setParagraph().run();
        } else {
            editor
                .chain()
                .focus()
                .toggleHeading({
                    level: Number(val[1]),
                })
                .run();
        }
    };

    return (
        <Select
            size="small"
            value={value}
            onChange={handleChange}
            sx={{
                minWidth: 140,
                ml: 1,
            }}
        >
            <MenuItem value="paragraph">
                Paragraph
            </MenuItem>

            <MenuItem value="h1">
                Heading 1
            </MenuItem>

            <MenuItem value="h2">
                Heading 2
            </MenuItem>

            <MenuItem value="h3">
                Heading 3
            </MenuItem>
        </Select>
    );
}