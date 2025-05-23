"use client"

import { type JSX, useContext } from "react"
import { globalContext } from "../context/GlobalContext"
import { Box, Typography, Container, Paper, Button } from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { NoAccountsOutlined } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

// Create a custom theme with RTL support and Hebrew font
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Assistant", "Rubik", "Heebo", sans-serif',
  },
  palette: {
    primary: {
      main: "#3f51b5",
    },
    error: {
      main: "#f44336",
    },
  },
})

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAdmin } = useContext(globalContext)
  const navigate = useNavigate()

  if (isAdmin === false) {
    return (
      <ThemeProvider theme={theme}>
        <Container
          maxWidth="sm"
          sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 5,
              borderRadius: 3,
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <NoAccountsOutlined color="error" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" component="h1" color="error.main" gutterBottom fontWeight="bold">
              גישה נדחתה
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              אין לך הרשאה לצפות בדף זה. רק מנהלים יכולים לגשת לתוכן זה.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/")}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  fontWeight: "bold",
                }}
              >
                חזרה לדף הבית
              </Button>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    )
  }

  return children
}

export default AdminRoute
