"use client"

import type React from "react"

import { useContext, useState } from "react"
import * as Yup from "yup"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { validationSchemaUserRegister } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"
import { convertToUser } from "../utils/converToUser"
import type { UserPostModel } from "../models/UserPostModel"
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  Grid,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
  Link,
} from "@mui/material"
import { Person, Email, Phone, Badge, Lock, Work, HowToReg } from "@mui/icons-material"

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

const UserRegister = ({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) => {
  const nav = useNavigate()
  const validationSchema = validationSchemaUserRegister
  const [errors, setErrors] = useState<string[]>([])
  const { setUser } = useContext(globalContext)
  const url = import.meta.env.VITE_API_URL
  const [myUser, setMyUser] = useState<UserPostModel>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: 0,
    idNumber: "",
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setMyUser((prevUser) => ({
      ...prevUser,
      [name]: name === "role" ? Number(value) : value,
    }))
  }

  const handleSubmit = (userRegister: UserPostModel) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log(userRegister)

    validationSchema
      .isValid(userRegister)
      .then(async (valid) => {
        setErrors([])
        if (valid) {
          try {
            const { data } = await axios.post<UserPostModel>(`${url}/Auth/user-register`, userRegister)
            setUser(convertToUser(data))

            if (onSubmitSuccess) onSubmitSuccess()
            nav("/")
          } catch (e) {
            console.log(e)
            setErrors(["שגיאה ברישום המשתמש"])
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <HowToReg color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              הרשמת משתמש חדש
            </Typography>
            <Typography variant="body1" color="text.secondary">
              נא למלא את כל הפרטים הנדרשים
            </Typography>
            <Divider sx={{ mt: 3 }} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(myUser)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="שם פרטי"
                  name="firstName"
                  value={myUser.firstName}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="שם משפחה"
                  name="lastName"
                  value={myUser.lastName}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="טלפון"
                  name="phone"
                  value={myUser.phone}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="מספר תעודת זהות"
                  name="idNumber"
                  value={myUser.idNumber}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} {...({} as any)}>
                <TextField
                  fullWidth
                  label="אימייל"
                  name="email"
                  type="email"
                  value={myUser.email}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="סיסמא"
                  name="password"
                  type="password"
                  value={myUser.password}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <TextField
                  fullWidth
                  label="תפקיד"
                  name="role"
                  type="number"
                  value={myUser.role}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.4)",
              }}
            >
              הירשם
            </Button>

            <Box sx={{ mt: 1, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                כבר יש לך חשבון?{" "}
                <Link href="/user-login" underline="hover" fontWeight="bold">
                  התחבר כאן
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

export default UserRegister
