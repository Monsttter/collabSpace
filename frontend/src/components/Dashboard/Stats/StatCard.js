import { Card, Box, Typography } from "@mui/material";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
}) => {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: "18px",
        border: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
        transition: "all .25s",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 30px rgba(15,23,42,.06)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* icon */}
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "14px",
            backgroundColor: `${color}15`,
            color: color,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            flexShrink: 0,

            "& svg": {
              width: 22,
              height: 22,
            },
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "text.primary",
              mb: .8,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1,
              color: "text.primary",
            }}
          >
            {value}
          </Typography>

          <Typography
            sx={{
              mt: .7,
              fontSize: 13,
              color: "text.secondary",
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default StatCard;
