import {
  Box,
  Card,
  Divider,
  Typography,
} from "@mui/material";

import ActivityItem from "./ActivityItem";

const activities = [
  {
    user: "Rahul",
    action: "edited",
    document: "API Design Document",
    time: "2 min ago",
  },
  {
    user: "Aman",
    action: "commented on",
    document: "Product Roadmap",
    time: "15 min ago",
  },
  {
    user: "Sneha",
    action: "joined",
    document: "Marketing Plan",
    time: "1 hour ago",
  },
  {
    user: "Rahul",
    action: "shared",
    document: "Database Schema",
    time: "2 hours ago",
  },
  {
    user: "Aman",
    action: "edited",
    document: "User Research Notes",
    time: "3 hours ago",
  },
];

const ActivityFeed = () => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: 1,
        borderColor: "divider",
        p: 3,
      }}
    >
      <Box
        sx={{
            display:"flex",
            justifyContent:"space-between",
            mb:2
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Activity Feed
        </Typography>

        <Typography
          sx={{
            color: "#4F46E5",
            fontWeight: 600,
            cursor: "pointer",

            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          View all
        </Typography>
      </Box>

      {activities.map((activity, index) => (
        <Box key={index}>
          <ActivityItem {...activity} />

          {index !== activities.length - 1 && (
            <Divider />
          )}
        </Box>
      ))}
    </Card>
  );
};

export default ActivityFeed;