import {
  Box,
  Typography,
  Paper,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Divider,
} from "@mui/material"
import { Person, Edit, Delete, Add, AdminPanelSettings, PersonOutline } from "@mui/icons-material"

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
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
  },
})

// Mock data for demonstration
const mockUsers = [
  { id: 1, firstName: "יוסי", lastName: "כהן", email: "yossi@example.com", role: 1, phone: "050-1234567" },
  { id: 2, firstName: "רונית", lastName: "לוי", email: "ronit@example.com", role: 0, phone: "052-7654321" },
  { id: 3, firstName: "אבי", lastName: "ישראלי", email: "avi@example.com", role: 0, phone: "054-9876543" },
  { id: 4, firstName: "מיכל", lastName: "דוד", email: "michal@example.com", role: 1, phone: "053-1472583" },
]

const UserManagemet = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #f5f7ff, #ffffff)",
          py: 4,
        }}
      >
        <Container>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Person color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold">
                    ניהול משתמשים
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    צפה, הוסף, ערוך או מחק משתמשים במערכת
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  py: 1,
                  px: 3,
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(63, 81, 181, 0.4)",
                }}
              >
                הוסף משתמש חדש
              </Button>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: 2 }}>
              <Table sx={{ minWidth: 650 }} aria-label="users table">
                <TableHead sx={{ bgcolor: "primary.main" }}>
                  <TableRow>
                    <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                      מזהה
                    </TableCell>
                    <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                      שם פרטי
                    </TableCell>
                    <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                      שם משפחה
                    </TableCell>
                    <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                      אימייל
                    </TableCell>
                    <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                      טלפון
                    </TableCell>
                    <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                      תפקיד
                    </TableCell>
                    <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                      פעולות
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 }, "&:hover": { bgcolor: "action.hover" } }}
                    >
                      <TableCell align="right">{user.id}</TableCell>
                      <TableCell align="right">{user.firstName}</TableCell>
                      <TableCell align="right">{user.lastName}</TableCell>
                      <TableCell align="right">{user.email}</TableCell>
                      <TableCell align="right">{user.phone}</TableCell>
                      <TableCell align="right">
                        <Chip
                          icon={user.role === 1 ? <AdminPanelSettings /> : <PersonOutline />}
                          label={user.role === 1 ? "מנהל" : "משתמש רגיל"}
                          color={user.role === 1 ? "primary" : "default"}
                          variant={user.role === 1 ? "filled" : "outlined"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                          <IconButton color="primary" size="small">
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton color="error" size="small">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default UserManagemet
