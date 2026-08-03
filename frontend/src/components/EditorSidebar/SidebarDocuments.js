import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    OutlinedInput,
    InputAdornment,
} from "@mui/material";

import { Paper, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import AddIcon from "@mui/icons-material/Add";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import SidebarDocumentItem from "./SidebarDocumentItem";
import { createDocument, fetchDocuments } from "../../api/documents";
import { useNavigate, useParams } from "react-router";
import { SearchOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setDocuments, addDocument } from "../../store/documents/documentSlice";

export default function SidebarDocuments() {
    const [creating, setCreating] = useState(false);
    const [title, setTitle] = useState("");
    const {id: currentDocumentId}= useParams();
    const [searchQuery, setSearchQuery] = useState("");

    // const [docs, setDocs] = useState([]);
    const docs = useSelector(state => state.documents.documents);
    // console.log("hello", docs, searchQuery);
    const [filteredDocuments, setFilteredDocuments]= useState([]);
    const navigate= useNavigate();
    const dispatch= useDispatch();
    
    const handleAddDocument= async()=>{
        const data= await createDocument(title);
        setCreating(false);
        // setDocs([data, ...docs]);
        dispatch(addDocument(data.data));
        // dispatch(setDocuments([data, ...docs]));
        // setFilteredDocuments([data, ...docs]);
        navigate(`/editor/${data.data.id}`);
    }

    const fetchDocs= async()=>{
        const data= await fetchDocuments();
        // setDocs(data);
        dispatch(setDocuments(data.data));
        // setFilteredDocuments(data);
    }
    
    const handleSearch= async(e)=>{
        setSearchQuery(e.target.value);
        setFilteredDocuments(()=> docs.filter(doc =>
            doc.title
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        ));
    }

    // Fetch all documents
    useEffect(() => {
        fetchDocs();
    }, []);

    useEffect(()=>{
        setFilteredDocuments(docs);
    }, [docs])

    // console.log(1, filteredDocuments);

    return (
        <>
            <Paper
            elevation={0}
            sx={{
                display: "flex",
                alignItems: "center",
                mx: 2,
                my: 2,
                px: 1.5,
                height: 42,
                border: "1px solid #E5E7EB",
                borderRadius: 3,
            }}
        >
            <SearchIcon
                sx={{
                    color: "#9CA3AF",
                    fontSize: 20,
                }}
            />

            <InputBase
                placeholder="Search documents..."
                sx={{
                    ml: 1,
                    flex: 1,
                    fontSize: 14,
                }}
                value={searchQuery}
                onChange={handleSearch}
            />
        </Paper>
            {/* Header */}
            <Box
                sx={{
                    px: 2,
                    py: 2,
                }}
            >
                <Box
                    sx={{
                        display:"flex",
                        justifyContent:"space-between",
                        alignItems:"center"
                    }}
                >
                    <Typography
                        fontWeight={700}
                        fontSize={15}
                    >
                        Documents
                    </Typography>

                    <IconButton
                        size="small"
                        onClick={() => setCreating(true)}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>

                {creating && (
                    <OutlinedInput
                        autoFocus
                        fullWidth
                        size="small"
                        value={title}
                        placeholder="Untitled document"
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        startAdornment={
                            <InputAdornment position="start">
                                <DescriptionOutlinedIcon
                                    fontSize="small"
                                />
                            </InputAdornment>
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton>
                                    <AddIcon onClick={handleAddDocument}/>
                                </IconButton>
                            </InputAdornment>
                        }
                        sx={{
                            mt: 2,
                            borderRadius: 2,
                            background: "#F9FAFB",
                        }}
                    />
                )}
            </Box>

            {/* Scrollable list */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: 1,
                    pb: 2,

                    "&::-webkit-scrollbar": {
                        width: 6,
                    },

                    "&::-webkit-scrollbar-thumb": {
                        background: "#D1D5DB",
                        borderRadius: 10,
                    },
                }}
            >
            {
            filteredDocuments.length === 0 ? (

            <Box
                sx={{
                    py:5,
                    textAlign:"center",
                    color:"text.secondary"
                }}
            >

            <SearchOff
                sx={{
                    fontSize:40,
                    opacity:.5
                }}
            />

            <Typography>

            No documents found

            </Typography>

            </Box>

            ) : (
                filteredDocuments.map((doc) => {

                    return(<SidebarDocumentItem
                        key={doc.id}
                        doc={doc}
                        active={doc.id == currentDocumentId}
                    />
                )})
            )}
            </Box>
        </>
    );
}