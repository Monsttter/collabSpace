import {
  Box,
  Card,
  Typography,
  Divider,
} from "@mui/material";

import DocumentRow from "./DocumentRow";

const documents = [
  {
    title: "Product Roadmap",
    updatedAt: "2h ago",
    favorite: true,
    collaborators: [
      { name: "Rahul" },
      { name: "Aman" },
      { name: "Sneha" },
    ],
  },
  {
    title: "API Design Document",
    updatedAt: "5h ago",
    collaborators: [
      { name: "Rahul" },
      { name: "Aman" },
      { name: "Sneha" },
    ],
  },
  {
    title: "Marketing Plan",
    updatedAt: "Yesterday",
    collaborators: [{ name: "Rahul" }],
  },
  {
    title: "Database Schema",
    updatedAt: "2 days ago",
    collaborators: [
      { name: "Rahul" },
      { name: "Aman" },
      { name: "Alex" },
      { name: "John" },
    ],
  },
  {
    title: "User Research Notes",
    updatedAt: "3 days ago",
    collaborators: [
      { name: "Sneha" },
    ],
  },
];

const RecentDocuments = () => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: "1px solid #ECEEF3",
        p: 3,
      }}
    >
      <Box
        sx={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            mb:2
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
        >
          Recent Documents
        </Typography>

        <Typography
          sx={{
            color: "#4F46E5",
            cursor: "pointer",
            fontWeight: 600,

            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          View all
        </Typography>
      </Box>

      {documents.map((doc, index) => (
        <Box key={doc.title}>
          <DocumentRow {...doc} />

          {index !== documents.length - 1 && (
            <Divider />
          )}
        </Box>
      ))}
    </Card>
  );
};

export default RecentDocuments;