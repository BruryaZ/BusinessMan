"use client"

import type React from "react"

import { useContext, useState } from "react"
import * as Yup from "yup"
import axios from "axios"
import type { UserPostModel } from "../models/UserPostModel"
import { validationSchemaUserRegister } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"
import type { UserDto } from "../models/UserDto"
import { converFromUserDto } from "../utils/convertFromUserDto"
// MUI imports
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Container,
    Alert,
    Grid,
    ThemeProvider,
    createTheme,
    CssBaseline,
    InputAdornment,
    Divider,
} from "@mui/material"
import { Person, Email, Phone, Badge, Lock, AdminPanelSettings } from "@mui/icons-material"

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

const AdminRegister = ({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) => {
    const validationSchema = validationSchemaUserRegister
    const [myAdmin, setMyAdmin] = useState<UserPostModel>({
        firstName: "יוסי", // ערך ברירת מחדל
        lastName: "כהן", // ערך ברירת מחדל
        email: "a@a", // ערך ברירת מחדל
        password: "", // ערך ברירת מחדל
        phone: "050-1234567", // ערך ברירת מחדל
        role: 1, // ערך ברירת מחדל
        idNumber: "123456789", // ערך ברירת מחדל
    })
    const [errors, setErrors] = useState<string[]>([])
    const globalContextDetails = useContext(globalContext)
    const url = import.meta.env.VITE_API_URL

    const handleSubmit = (adminRegister: UserPostModel) => async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        validationSchema
            .isValid(adminRegister)
            .then(async (valid) => {
                setErrors([])
                if (valid) {
                    try {
                        const { data } = await axios.post<UserDto>(`${url}/Auth/admin-register`, adminRegister, { withCredentials: true })
                        globalContextDetails.setUser(converFromUserDto(data))
                        if (data.role == 1) {
                            globalContextDetails.setIsAdmin(true)
                        }
                        if (onSubmitSuccess) onSubmitSuccess()
                    } catch (e) {
                        console.log(e)
                        setErrors(["שגיאה ברישום"])
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
        const { name, value, type } = event.target
        setMyAdmin((prevUser) => ({
            ...prevUser,
            [name]: type === "number" ? Number(value) : value,
        }))
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
                        <AdminPanelSettings color="primary" sx={{ fontSize: 48, mb: 2 }} />
                        <Typography variant="h4" component="h1" gutterBottom>
                            רישום מנהל חדש
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            נא למלא את כל הפרטים הנדרשים
                        </Typography>
                        <Divider sx={{ mt: 3 }} />
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit(myAdmin)}
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
                                    value={myAdmin.firstName}
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
                                    value={myAdmin.lastName}
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
                                    value={myAdmin.phone}
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
                                    value={myAdmin.idNumber}
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
                                    value={myAdmin.email}
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
                            <Grid item xs={12} {...({} as any)}>
                                <TextField
                                    fullWidth
                                    label="סיסמא"
                                    name="password"
                                    type="password"
                                    value={myAdmin.password}
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
                            שמור פרטים
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
    )
}

export default AdminRegister
