"use client"

import type React from "react"

import { useContext, useState } from "react"
import * as Yup from "yup"
import axios from "axios"
import type { AdminRegister } from "../models/AdminRegister"
import { useNavigate } from "react-router-dom"
import { validationSchemaUserLogin } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  InputAdornment,
  Avatar,
  Link,
  Stack,
  Divider,
} from "@mui/material"
import { Email, Lock, Person, Login as LoginIcon } from "@mui/icons-material"

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
    <Container maxWidth="sm" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
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
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 70,
                height: 70,
                mb: 2,
                mx: "auto",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
              }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Avatar>

            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              כניסת משתמש
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              ברוכים הבאים למערכת ניהול העסק
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="אימייל"
            name="email"
            type="email"
            variant="outlined"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 1.5 }}>
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="הזן את האימייל שלך"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              },
            }}
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
                <InputAdornment position="start" sx={{ mr: 1.5 }}>
                  <Lock color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="הזן את הסיסמה שלך"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "white",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            startIcon={<LoginIcon />}
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1.1rem",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
            }}
          >
            התחבר
          </Button>

          <Divider sx={{ width: "100%", my: 1 }}>
            <Typography variant="caption" color="text.secondary">
              או
            </Typography>
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => nav("/register-user")}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            הירשם עכשיו
          </Button>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              מנהל?
            </Typography>
            <Link href="/admin-login" underline="hover" fontWeight="medium">
              התחבר כמנהל
            </Link>
          </Stack>

          {errors.length > 0 && (
            <Box sx={{ width: "100%", mt: 2 }}>
              {errors.map((error, index) => (
                <Alert
                  key={index}
                  severity="error"
                  sx={{ mb: 1, borderRadius: 2, boxShadow: "0 2px 10px rgba(239, 68, 68, 0.1)" }}
                >
                  {error}
                </Alert>
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default UserLogin
