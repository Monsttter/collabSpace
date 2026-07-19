import Grid from "@mui/material/Grid";

import {
  FileText,
  Users,
  UsersRound,
  HardDrive,
} from "lucide-react";

import StatCard from "./StatCard";

const StatsSection = () => {
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
          value="24"
          subtitle="Total documents"
          icon={<FileText strokeWidth={2} />}
          color="#4F46E5"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <StatCard
          title="Active Sessions"
          value="8"
          subtitle="Currently active"
          icon={<Users strokeWidth={2} />}
          color="#10B981"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <StatCard
          title="Team Members"
          value="12"
          subtitle="Across 3 projects"
          icon={<UsersRound strokeWidth={2} />}
          color="#8B5CF6"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <StatCard
          title="Storage Used"
          value="2.4 GB"
          subtitle="of 10 GB"
          icon={<HardDrive strokeWidth={2} />}
          color="#F59E0B"
        />
      </Grid>
    </Grid>
  );
};

export default StatsSection;