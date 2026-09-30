import {
  Avatar,
  Box,
  Typography,
} from "@mui/material";

const ActivityItem = ({
  user,
  action,
  document,
  time,
  avatar,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        py: 1.5,
        borderRadius: 2,
        px: 1,
        transition: ".2s",

        "&:hover": {
          background: "#F8FAFC",
        },
      }}
    >
      <Avatar
        src={avatar}
        sx={{
          width: 38,
          height: 38,
          fontSize: 14,
        }}
      >
        {!avatar && user[0]}
      </Avatar>

      <Box flex={1}>
        <Typography
          sx={{
            fontSize: 14,
            lineHeight: 1.4,
          }}
        >
          <strong>{user}</strong>{" "}
          {action}{" "}
          <strong>{document}</strong>
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
            fontSize: 13,
            mt: .5,
          }}
        >
          {time}
        </Typography>
      </Box>
    </Box>
  );
};

export default ActivityItem;