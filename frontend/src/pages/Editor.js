import Editor from "../components/Editor/Editor";
import { useParams } from "react-router";

export default function EditorPage() {

    const {id: docId}= useParams();

    return (
        <Editor key={docId}/>
    );
}