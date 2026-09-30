import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Button,
  Paper,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import { useDispatch, useSelector } from "react-redux";
import { clearPendingSelection, closeDrawer } from "../../../../store/ui/uiSlice";
// import { useParams } from "react-router";
import { useCollaborationContext } from "../../context/CollaborationContext";
import MemberCard from "./MemberCard";

const ROLE_ORDER = {
  owner: 0,
  editor: 1,
  viewer: 2,
};

export default function CollaboratorsPanel({
  openShareDialog
}) {
  const [search, setSearch] = useState("");

  // const {id: documentId}= useParams();

    const dispatch= useDispatch();

    
    const { users } =
    useCollaborationContext();
    
    const document = useSelector(
        state => state.documents.currentDocument
    );
    
    const {user}= useSelector(state => state.auth);

    const isOwner= document.role === "owner";

    const {
        collaborators
    } = useSelector(
        (state) => state.collaborators
    );

    const collaborationUsersById = useMemo(() => {
      const map = new Map();

      users.forEach((user) => {
        map.set(String(user.id), user);
      });

      return map;
    }, [users]);

    const collaboratorsWithPresence = useMemo(() => {
  return collaborators.map((collaborator) => {
    const liveUser = collaborationUsersById.get(
      String(collaborator.id)
    );

    return {
      ...collaborator,

      online: Boolean(liveUser),

      color: liveUser?.color || null,
    };
  });
}, [collaborators, collaborationUsersById]);

    const handleClose= ()=>{
            dispatch(closeDrawer());
            dispatch(clearPendingSelection());
        }

  const filteredCollaborators = useMemo(() => {
  const query = search.trim().toLowerCase();

  const filtered = query
    ? collaboratorsWithPresence.filter((collaborator) =>
        `${collaborator.name ?? ""} ${collaborator.email ?? ""}`
          .toLowerCase()
          .includes(query),
      )
    : collaboratorsWithPresence;

  return [...filtered].sort((a, b) => {
    const roleDifference =
      (ROLE_ORDER[a.role] ?? 99) -
      (ROLE_ORDER[b.role] ?? 99);

    if (roleDifference !== 0) {
      return roleDifference;
    }

    return (a.name ?? "").localeCompare(
      b.name ?? "",
      undefined,
      { sensitivity: "base" },
    );
  });
}, [collaboratorsWithPresence, search]);

  return (
    <Paper
      anchor="right"
      sx= {{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Collaborators
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {collaborators.length}{" "}
            {collaborators.length === 1
              ? "collaborator"
              : "collaborators"}
          </Typography>
        </Box>

        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Search */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          flexShrink: 0,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search collaborators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment:
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
            },
          }}
        />
      </Box>

      {/* Scrollable collaborators */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {filteredCollaborators.length === 0 ? (
          <Box
            sx={{
              py: 8,
              px: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No collaborators found.
            </Typography>
          </Box>
        ) : (
          filteredCollaborators.map((collaborator) => (
            <MemberCard
              key={collaborator.id}
              collaborator={collaborator}
              currentUserId={user.id}
              isOwner={isOwner}
            />
          ))
        )}
      </Box>
            {/* (<MemberCard member={collaborator}/>) */}

      {/* Fixed bottom action */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          flexShrink: 0,
          bgcolor: "background.paper",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          startIcon={<PersonAddOutlinedIcon />}
          onClick={openShareDialog}
          sx={{
            py: 1.1,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Invite people
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mt: 1,
                textAlign:"center"
           }}
        >
          Invite people to view or edit this document.
        </Typography>
      </Box>
    </Paper>
  );
}