// import Typography from "@mui/material/Typography";
import { Box, Typography, Button } from "@mui/material";
import { Plus } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatsSection from "./StatsSection";
import RecentDocuments from "../../components/RecentDocuments/RecentDocuments";
import ActivityFeed from "../../components/ActivityFeed/ActivityFeed";

const Dashboard = () => {
    return (
        <DashboardLayout>

            <Box
            sx={{
                px: 5,
                py: 4,
            }}
        >
            <Box sx={{ mb: 5 }}>
                <Typography
                    variant="h3"
                    fontWeight={700}
                >
                    Welcome back, Rahul 👋
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        color: "text.secondary",
                        fontSize: 16,
                    }}
                >
                    Here's what's happening in your workspace today.
                </Typography>
            </Box>

            <Box mt={4}>
                <StatsSection />
            </Box>

            <Box
                mt={5}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 3,
                }}
            >
                <RecentDocuments />

                <ActivityFeed />
            </Box>
        </Box>

        </DashboardLayout>
    );
};

export default Dashboard;