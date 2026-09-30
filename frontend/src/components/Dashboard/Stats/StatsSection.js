import Grid from "@mui/material/Grid";

import {
  FileText,
  Users,
  // UsersRound,
  HardDrive,
  Star,
} from "lucide-react";

import StatCard from "./StatCard";

const StatsSection = ({ documents }) => {
  const favoriteCount = documents?.filter((document) => document.favorite).length;
  const sharedCount = documents?.filter((document) => document.role !== "owner").length;
  const recentlyUpdated = documents?.filter((document) =>
    new Date(document.updated_at) > new Date(Date.now() - 7 * 86400000)
  ).length;
  return (
    <Grid
      container
      spacing={3}
      sx={{
        width: "100%",
        mt: 1,
        mb: 5,
      }}
    >
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <StatCard
          title="Documents"
          value={documents.length}
          subtitle="In your workspace"
          icon={<FileText strokeWidth={2} />}
          color="#4F46E5"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <StatCard
          title="Shared with you"
          value={sharedCount}
          subtitle="Collaborative documents"
          icon={<Users strokeWidth={2} />}
          color="#10B981"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <StatCard
          title="Favorites"
          value={favoriteCount}
          subtitle="Saved for quick access"
          icon={<Star strokeWidth={2} />}
          color="#facc15"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <StatCard
          title="Recently updated"
          value={recentlyUpdated}
          subtitle="In the last 7 days"
          icon={<HardDrive strokeWidth={2} />}
          color="#F59E0B"
        />
      </Grid>
    </Grid>
  );
};

export default StatsSection;
