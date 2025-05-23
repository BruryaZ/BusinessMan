"use client"

import type React from "react"

import axios from "axios"
import { type ChangeEvent, useContext, useState } from "react"
import type { InvoiceDto } from "../models/InvoiceDto"
import { globalContext } from "../context/GlobalContext"
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Grid,
  InputAdornment,
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
} from "@mui/material"
import { AttachMoney, MoneyOff, Send, Receipt } from "@mui/icons-material"

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
    success: {
      main: "#4caf50",
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
          padding: "10px 24px",
          textTransform: "none",
          fontSize: "1rem",
        },
      },
    },
  },
})

const IncomAndExpennses = () => {
  const [income, setIncome] = useState(0)
  const [expenditure, setExpenditure] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const globalContextDetails = useContext(globalContext)

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value
    const name = event.target.name

    if (name === "income") {
      setIncome(Number(value))
    } else if (name === "expenditure") {
      setExpenditure(Number(value))
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccess(false)
    setError(null)

    const invoiceToSend: InvoiceDto = {
      id: globalContextDetails.user.id,
      amountDebit: expenditure,
      amountCredit: income,
      invoiceDate: new Date(),
      status: 1,
      notes: "",
      createdAt: new Date(),
      createdBy: globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName,
      updatedAt: new Date(),
      updatedBy: globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName,
      invoicePath: "",
      userId: globalContextDetails.user.id,
      businessId: globalContextDetails.user.businessId ?? 0,
    }

    try {
      await axios.post("https://localhost:7031/api/Invoice", invoiceToSend)
      setSuccess(true)
      setIncome(0)
      setExpenditure(0)
    } catch (error) {
      console.error("Error saving invoice:", error)
      setError("אירעה שגיאה בשמירת הנתונים. אנא נסה שנית.")
    }
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
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Receipt color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              ניהול הכנסות והוצאות
            </Typography>
            <Typography variant="body1" color="text.secondary">
              הזן את ההכנסות וההוצאות של העסק שלך
            </Typography>
            <Divider sx={{ mt: 3 }} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}  {...({} as any)}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "success.light",
                    color: "success.contrastText",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AttachMoney sx={{ fontSize: 28, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      הכנסות
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="סכום ההכנסה"
                    name="income"
                    type="number"
                    value={income || ""}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                    }}
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "success.main",
                        },
                        "&:hover fieldset": {
                          borderColor: "success.dark",
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} {...({} as any)}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: "error.light",
                    color: "error.contrastText",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MoneyOff sx={{ fontSize: 28, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      הוצאות
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="סכום ההוצאה"
                    name="expenditure"
                    type="number"
                    value={expenditure || ""}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₪</InputAdornment>,
                    }}
                    sx={{
                      bgcolor: "white",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "error.main",
                        },
                        "&:hover fieldset": {
                          borderColor: "error.dark",
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Send />}
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.4)",
              }}
            >
              שמור נתונים
            </Button>

            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                הנתונים נשמרו בהצלחה!
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default IncomAndExpennses
