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
  Divider,
  Link,
  Stack,
} from "@mui/material"
import { Person, Email, Phone, Badge, Lock, Work, HowToReg, ArrowBack } from "@mui/icons-material"

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
            const { data } = await axios.post<UserPostModel>(`${url}/Auth/user-register`, userRegister, { withCredentials: true })
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
    <Container maxWidth="md" sx={{ py: 4, textAlign: "right" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "primary.light",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
            }}
          >
            <HowToReg sx={{ fontSize: 40 }} />
          </Box>
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
                    <InputAdornment position="start" sx={{ mr: 1.5 }}>
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                  },
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
                    <InputAdornment position="start" sx={{ mr: 1.5 }}>
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                  },
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
                    <InputAdornment position="start" sx={{ mr: 1.5 }}>
                      <Phone color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                  },
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
                    <InputAdornment position="start" sx={{ mr: 1.5 }}>
                      <Badge color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                  },
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
                    <InputAdornment position="start" sx={{ mr: 1.5 }}>
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                  },
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
                    <InputAdornment position="start" sx={{ mr: 1.5 }}>
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                  },
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
                    <InputAdornment position="start" sx={{ mr: 1.5 }}>
                      <Work color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<HowToReg />}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
                flexGrow: 1,
              }}
            >
              הירשם
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => nav("/user-login")}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              חזרה לכניסה
            </Button>
          </Stack>

          <Box sx={{ mt: 3, textAlign: "center" }}>
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

export default UserRegister
