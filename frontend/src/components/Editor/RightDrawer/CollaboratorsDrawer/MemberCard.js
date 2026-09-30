import React, { useState } from "react";
import {
  Box,
  // Drawer,
  Typography,
  IconButton,
  // TextField,
  // InputAdornment,
  Avatar,
  Chip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  // Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
// import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { removeCollaborator, updateCollaboratorRole } from "../../../../store/collaborators/collaboratorsThunks";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const getRoleStyles = (role) => {
  switch (role) {
    case "owner":
      return {
        bgcolor: "#f3e0fc",
        color: "#a56adf",
      };

    case "editor":
      return {
        bgcolor: "#e8f5e9",
        color: "#2e9d50",
      };

    case "viewer":
      return {
        bgcolor: "#eaf2ff",
        color: "#2563eb",
      };

    default:
      return {
        bgcolor: "#eeeeee",
        color: "#333333",
      };
  }
};

export default function MemberCard({
  collaborator,
  currentUserId,
  isOwner
}) {

    const {id: documentId}= useParams();

    const dispatch= useDispatch();

  const [menuAnchor, setMenuAnchor] = useState(null);

  const menuOpen = Boolean(menuAnchor);

  const isCurrentUser =
    String(collaborator.id) === String(currentUserId);

  const canManage =
    isOwner &&
    !isCurrentUser &&
    collaborator.role !== "owner";

  const [roleMenuAnchor, setRoleMenuAnchor] = useState(null);

  const roleMenuOpen = Boolean(roleMenuAnchor);
  
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);
  
const handleOpenRoleMenu = (event) => {
  setRoleMenuAnchor(event.currentTarget);
};

const handleCloseRoleMenu = () => {
  setRoleMenuAnchor(null);
};

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
    
    const handleRemove= ()=>{
        handleMenuClose();
        setRemoveTarget(collaborator);
        // console.log(documentId, collaborator.id);
        // dispatch(removeCollaborator({documentId, userId: collaborator.id}));
    }


const handleConfirmRemove = async () => {
  if (!removeTarget) return;

  try {
    setRemoving(true);

    await dispatch(
      removeCollaborator({
        documentId,
        userId: removeTarget.id,
      })
    ).unwrap();

    setRemoveTarget(null);
  } catch (error) {
    console.error("Failed to remove collaborator:", error);
  } finally {
    setRemoving(false);
  }
};
  
  const handleChangeRole= (role)=>{
      handleMenuClose();
      handleCloseRoleMenu();
              dispatch(
              updateCollaboratorRole({
                  documentId,
  
                  userId:
                      collaborator.id,
  
                  role: role
              })
          );
      }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.5,
          minHeight: 72,

          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Avatar
            src={collaborator.avatar}
            sx={{
              width: 42,
              height: 42,
              fontSize: 14,
            }}
          >
            {getInitials(collaborator.username)}
          </Avatar>

          {/* Online indicator */}
          <Box
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: collaborator.online
                ? collaborator.color
                : "grey.400",
              border: "2px solid",
              borderColor: "background.paper",
            }}
          />
        </Box>

        {/* User information */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
          variant="h6"
                fontWeight={700}
            sx={{
              fontSize: "16px"
            }}
            noWrap
          >
            {isCurrentUser
              ? `You (${collaborator.username})`
              : collaborator.username}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            display="block"
            sx={{fontSize: 13}}
          >
            {collaborator.email}
          </Typography>
        </Box>

        {/* Role */}
        <Chip
          label={
            collaborator.role.charAt(0).toUpperCase() +
            collaborator.role.slice(1)
          }
          size="small"
          sx={{
            ...getRoleStyles(collaborator.role),

            height: 30,
            borderRadius: "8px",

            fontSize: "13px",
            fontWeight: 500,

            flexShrink: 0,

            "& .MuiChip-label": {
              px: 1.4,
            },
          }}
        />

        {/* Actions */}
        {canManage && (
          <>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
              anchorEl={menuAnchor}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleOpenRoleMenu}>

                <ManageAccountsOutlinedIcon
                  fontSize="small"
                  sx={{ mr: 1.5 }}
                />

                <ListItemText>
                  Change role
                </ListItemText>
              </MenuItem>

              <MenuItem
                onClick={handleRemove}
                sx={{
                  color: "error.main",
                }}
              >
                <ListItemIcon>
                  <PersonRemoveOutlinedIcon
                    fontSize="small"
                    color="error"
                  />
                </ListItemIcon>

                <ListItemText>
                  Remove access
                </ListItemText>
              </MenuItem>
            </Menu>

            <Menu
              anchorEl={roleMenuAnchor}
              open={roleMenuOpen}
              onClose={handleCloseRoleMenu}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                selected={collaborator.role === "editor"}
                onClick={() => {
                  handleChangeRole("editor");
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#2e9d50",
                    mr: 1.5,
                  }}
                />

                Editor
              </MenuItem>

              <MenuItem
                selected={collaborator.role === "viewer"}
                onClick={() => {
                  handleChangeRole("viewer");
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#2563eb",
                    mr: 1.5,
                  }}
                />

                Viewer
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      <Divider />

      <Dialog
  open={Boolean(removeTarget)}
  onClose={() => setRemoveTarget(null)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle
    sx={{
      fontWeight: 600,
    }}
  >
    Remove collaborator?
  </DialogTitle>

  <DialogContent>
    <Typography color="text.secondary">
      Are you sure you want to remove{" "}
      <strong>{removeTarget?.username}</strong>{" "}
      from this document?
    </Typography>
  </DialogContent>

  <DialogActions
    sx={{
      px: 3,
      pb: 2.5,
    }}
  >
    <Button
      onClick={() => setRemoveTarget(null)}
      sx={{
        textTransform: "none",
        color: "text.secondary",
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      color="error"
      onClick={handleConfirmRemove}
      disabled={removing}
      sx={{
        textTransform: "none",
        borderRadius: "8px",
      }}
    >
      {removing ? "Removing..." : "Remove"}
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
}