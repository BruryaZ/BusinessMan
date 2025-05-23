import { Box } from "@mui/material";
import React from "react";

const CenteredLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // חשוב! כדי שיתפוס את כל הגובה
        width: "100%",
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 600 }}>{children}</Box>
    </Box>
  );
};

export default CenteredLayout;

