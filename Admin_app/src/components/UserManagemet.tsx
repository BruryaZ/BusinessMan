import React, { useEffect, useState } from "react"
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
import {
  Person,
  Edit,
  Delete,
  Add,
  AdminPanelSettings,
  PersonOutline,
} from "@mui/icons-material"
import axios from "axios"
import { useNavigate } from "react-router-dom"
const url = import.meta.env.VITE_API_URL

// טיפוס לנתוני המשתמש
interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  role: number // 0 = רגיל, 1 = מנהל
}

// ערכת נושא עם RTL וגופן עברי
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Assistant", "Rubik", "Heebo", sans-serif',
  },
  palette: {
    primary: { main: "#3f51b5" },
    secondary: { main: "#f50057" },
    background: { default: "#f5f5f5" },
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

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const nav = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const {data} = await axios.get<User[]>(`${url}/api/User`)
        setUsers(data)
      } catch (err) {
        console.error("שגיאה בטעינת משתמשים:", err)
      }
    }
    fetchUsers()
  }, [])

  const handleDelete = async (id: number) => {
    console.log(id);
    
    if (window.confirm("האם אתה בטוח שברצונך למחוק את המשתמש?")) {
      await axios.delete(`${url}/api/User/${id}`)
      try {
        const res = await axios.delete(`${url}/api/User/${id}`);
        if (res.status >= 200 && res.status < 300) {
          setUsers((prev) => prev.filter((user) => user.id !== id));
        } else {
          alert("מחיקה נכשלה");
        }
      } catch (err) {
        console.error("שגיאה במחיקה:", err);
      }
      }
    }
  
    const handleEdit = (id: number) => {
      nav(`/edit-user/${id}`)
    }

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
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Person color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
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
                  sx={{ py: 1, px: 3, fontWeight: "bold" }}
                  onClick={() => nav("/register-user")}
                >
                  הוסף משתמש חדש
                </Button>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="users table">
                  <TableHead sx={{ bgcolor: "primary.main" }}>
                    <TableRow>
                      {["מזהה", "שם פרטי", "שם משפחה", "אימייל", "טלפון", "תפקיד", "פעולות"].map((col) => (
                        <TableCell key={col} align="right" sx={{ color: "white", fontWeight: "bold" }}>
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          "&:last-child td": { border: 0 },
                          "&:hover": { bgcolor: "action.hover" },
                        }}
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
                            <IconButton color="primary" size="small" onClick={() => handleEdit(user.id)}>
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton color="error" size="small" onClick={() => handleDelete(user.id)}>
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

  export default UserManagement
