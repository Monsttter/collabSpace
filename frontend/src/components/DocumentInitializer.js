import { useEffect } from "react";
import { useParams } from "react-router";
import { setCurrentDocument } from "../store/documents/documentSlice";
import { fetchDocument } from "../api/documents";
import { useDispatch } from "react-redux";

export default function DocumentInitializer({ children }) {

    const { id } = useParams();

    const dispatch = useDispatch();
    
    useEffect(() => {

        async function loadDocument() {

            const data = await fetchDocument(id);

            dispatch(setCurrentDocument(data.data));

        }

        if (id)
            loadDocument();

    }, [id]);

    return children;
}