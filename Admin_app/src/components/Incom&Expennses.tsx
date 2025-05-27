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
  Divider,
  Card,
  CardContent,
  Stack,
} from "@mui/material"
import { AttachMoney, MoneyOff, Send, Receipt, TrendingUp, TrendingDown, BarChart } from "@mui/icons-material"

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
      id: 0,
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
      await axios.post("https://localhost:7031/api/Invoice", invoiceToSend, { withCredentials: true })
      setSuccess(true)
      setIncome(0)
      setExpenditure(0)
    } catch (error) {
      console.error("Error saving invoice:", error)
      setError("אירעה שגיאה בשמירת הנתונים. אנא נסה שנית.")
    }
  }

  // Sample data for the financial summary
  const financialSummary = [
    { title: "הכנסות החודש", amount: "₪15,750", change: "+12%", icon: <TrendingUp />, color: "success" },
    { title: "הוצאות החודש", amount: "₪8,320", change: "-5%", icon: <TrendingDown />, color: "error" },
    { title: "רווח נקי", amount: "₪7,430", change: "+18%", icon: <BarChart />, color: "primary" },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: "right" }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          mb: 4,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
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
            <Receipt sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            ניהול הכנסות והוצאות
          </Typography>
          <Typography variant="body1" color="text.secondary">
            הזן את ההכנסות וההוצאות של העסק שלך לניהול פיננסי יעיל
          </Typography>
          <Divider sx={{ mt: 3 }} />
        </Box>

        {/* Financial Summary */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {financialSummary.map((item, index) => (
            <Grid item xs={12} md={4} key={index} {...({} as any)}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      {item.title}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: `${item.color}.light`,
                        color: `${item.color}.main`,
                        p: 1,
                        borderRadius: "50%",
                        mr: 2,
                      }}
                    >
                      {item.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color={`${item.color}.main`} gutterBottom>
                    {item.amount}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={item.change.startsWith("+") ? "success.main" : "error.main"}
                    >
                      {item.change}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      מהחודש הקודם
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            הוספת תנועה חדשה
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6} {...({} as any)}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      bgcolor: "success.main",
                      color: "white",
                      p: 1,
                      borderRadius: "50%",
                      mr: 2,
                    }}
                  >
                    <AttachMoney />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="success.dark">
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
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "success.main",
                        borderWidth: 2,
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
                  borderRadius: 3,
                  bgcolor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  height: "100%",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      bgcolor: "error.main",
                      color: "white",
                      p: 1,
                      borderRadius: "50%",
                      mr: 2,
                    }}
                  >
                    <MoneyOff />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="error.dark">
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
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "error.main",
                        borderWidth: 2,
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

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Send />}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.2)",
                flexGrow: { sm: 1 },
              }}
            >
              שמור נתונים
            </Button>

            <Button
              type="reset"
              variant="outlined"
              size="large"
              onClick={() => {
                setIncome(0)
                setExpenditure(0)
                setSuccess(false)
                setError(null)
              }}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              נקה טופס
            </Button>
          </Stack>

          {success && (
            <Alert
              severity="success"
              sx={{
                mt: 3,
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.2)",
                border: "1px solid rgba(16, 185, 129, 0.1)",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                הנתונים נשמרו בהצלחה!
              </Typography>
              <Typography variant="body2">התנועה הפיננסית נוספה למערכת בהצלחה.</Typography>
            </Alert>
          )}

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.1)",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                שגיאה!
              </Typography>
              <Typography variant="body2">{error}</Typography>
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default IncomAndExpennses
