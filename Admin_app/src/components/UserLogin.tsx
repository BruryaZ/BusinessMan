"use client"

import type React from "react"

import { useContext, useState } from "react"
import * as Yup from "yup"
import axios from "axios"
import type { AdminRegister } from "../models/AdminRegister"
import { useNavigate } from "react-router-dom"
import { validationSchemaUserLogin } from "../utils/validationSchema"
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
  Link,
} from "@mui/material"
import { Email, Lock, Person } from "@mui/icons-material"

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

const UserLogin = () => {
  const nav = useNavigate()
  const validationSchema = validationSchemaUserLogin
  const [userLogin, setUserLogin] = useState<AdminRegister>({ email: "", password: "" })
  const [errors, setErrors] = useState<string[]>([])
  const url = import.meta.env.VITE_API_URL
  const { setUser } = useContext(globalContext)

  const handleSubmit = (userLogin: AdminRegister) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    validationSchema
      .isValid(userLogin)
      .then(async (valid) => {
        setErrors([])

        if (valid) {
          try {
            const { data } = await axios.post<any>(`${url}/Auth/user-login`, userLogin) // TODO
            setUser(data.user)
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
    setUserLogin((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  return (
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
            onSubmit={handleSubmit(userLogin)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mb: 1 }}>
              <Person fontSize="large" />
            </Avatar>

            <Typography variant="h4" component="h1" align="center" gutterBottom>
              כניסת משתמש
            </Typography>

            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
              ברוכים הבאים למערכת ניהול העסק
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

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                אין לך חשבון עדיין?{" "}
                <Link href="/register" underline="hover" fontWeight="bold">
                  הירשם עכשיו
                </Link>
              </Typography>
            </Box>

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
  )
}

export default UserLogin
