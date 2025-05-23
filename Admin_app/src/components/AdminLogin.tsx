"use client"

import { useContext, useState } from "react"
import type { Admin } from "../models/Admin"
import * as Yup from "yup"
import axios from "axios"
import type { AdminRegister } from "../models/AdminRegister"
import { useNavigate } from "react-router-dom"
import { validationSchemaAdminLogin } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"
// MUI imports
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Avatar,
} from "@mui/material"
import { Email, Lock, AdminPanelSettings } from "@mui/icons-material"
import CenteredLayout from "./CenteredLayout"

// Create a custom theme with RTL support and Hebrew font
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"Assistant", "Rubik", "Heebo", sans-serif',
    h4: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
    },
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
    MuiTextField: {
      styleOverrides: {
        root: {
          direction: "rtl",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          textTransform: "none",
          fontSize: "1rem",
        },
      },
    },
  },
})

const AdmineLogin = () => {
  const nav = useNavigate()
  const [admin, setAdmin] = useState<Admin>({ email: "", password: "" })
  const [errors, setErrors] = useState<string[]>([])
  const url = import.meta.env.VITE_API_URL
  const validationSchema = validationSchemaAdminLogin
  const globalContextDetails = useContext(globalContext)

  const handleSubmit = (adminRegister: AdminRegister) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validationSchema
      .isValid(admin)
      .then(async (valid) => {
        setErrors([])

        if (valid) {
          try {
            const { data } = await axios.post<any>(`${url}/Auth/admin-login`, adminRegister, { withCredentials: true }) // TODO
            globalContextDetails.setUser(data.user)
            globalContextDetails.setIsAdmin(true)
            globalContextDetails.setBusinessGlobal(data.business);
            nav("/")
          } catch (e) {
            console.log(e)
            setErrors(["שם משתמש או סיסמה שגויים"])
          }
        } else {
          setErrors(["נא למלא את כל השדות הנדרשים"])
        }
      })
      .catch((err) => {
        console.log("Validation error:", err.errors)
        if (err instanceof Yup.ValidationError) {
          setErrors(err.errors)
        }
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }))
  }

  return (
    <CenteredLayout>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container
          maxWidth="sm"
          sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit(admin)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "center",
              }}
            >
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mb: 1 }}>
                <AdminPanelSettings fontSize="large" />
              </Avatar>

              <Typography variant="h4" component="h1" align="center" gutterBottom>
                כניסת מנהל
              </Typography>

              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                ברוכים הבאים למערכת הניהול
              </Typography>

              <TextField
                fullWidth
                label="אימייל"
                name="email"
                type="email"
                variant="outlined"
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="הזן את האימייל שלך"
              />

              <TextField
                fullWidth
                label="סיסמא"
                name="password"
                type="password"
                variant="outlined"
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="הזן את הסיסמה שלך"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 12px rgba(63, 81, 181, 0.4)",
                }}
              >
                התחבר
              </Button>

              {errors.length > 0 && (
                <Box sx={{ width: "100%", mt: 2 }}>
                  {errors.map((error, index) => (
                    <Alert key={index} severity="error" sx={{ mb: 1 }}>
                      {error}
                    </Alert>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </CenteredLayout>
  )
}

export default AdmineLogin