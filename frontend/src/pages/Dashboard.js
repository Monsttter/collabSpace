// import Typography from "@mui/material/Typography";
import { Box, Typography, Alert } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import StatsSection from "../components/Dashboard/Stats/StatsSection";
import RecentDocuments from "../components/Dashboard/RecentDocuments/RecentDocuments";
// import ActivityFeed from "../components/Dashboard/ActivityFeed/ActivityFeed";
import { fetchDocuments } from "../api/documents";
import { setDocuments, setError, setLoading } from "../store/documents/documentSlice";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { documents, loading, error } = useSelector((state) => state.documents);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        let active = true;
        async function loadDocuments() {
            dispatch(setLoading(true));
            try {
                const response = await fetchDocuments();
                if (active && response?.success) dispatch(setDocuments(response.data));
            } catch (loadError) {
                if (active) dispatch(setError("We couldn't load your documents. Please refresh and try again."));
            } finally {
                if (active) dispatch(setLoading(false));
            }
        }
        loadDocuments();
        return () => { active = false; };
    }, [dispatch]);

    return (

        <Box>
            
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
                    Welcome back{user?.username ? `, ${user.username}` : ""} 👋
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
                <StatsSection documents={documents} />
            </Box>

            {error && <Alert severity="error" onClose={() => dispatch(setError(null))} sx={{ mb: 3 }}>{error}</Alert>}

            <Box
                mt={5}
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
                    gap: 3,
                }}
            >
                <RecentDocuments documents={documents} loading={loading} />

                {/* <ActivityFeed /> */}
            </Box>
        </Box>
        </Box>
    );
};

export default Dashboard;
