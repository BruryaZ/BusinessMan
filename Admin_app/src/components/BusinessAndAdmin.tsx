"use client"

import { useContext, useEffect, useState } from "react"
import RegisterBusinessData from "./RegisterBusinessData"
import { globalContext } from "../context/GlobalContext"
import axios from "axios"
import type { BusinessResponsePutModel } from "../models/BusinessResponsePutModel"
import AdminRegister from "./AdminRegister"
import type { UserDto } from "../models/UserDto"
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material"
import { Business, Person, Check } from "@mui/icons-material"

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

const BusinessAndAdmin = () => {
  const [isBusiness, setIsBusiness] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [businessDone, setBusinessDone] = useState(false)
  const [adminDone] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const globalContextDetails = useContext(globalContext)
  const url = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (businessDone && adminDone) {
      // OK
      updateObjects()
      // שניהם הסתיימו => אפשר להמשיך לשלב הבא או לנווט
      console.log("הטפסים נוספו בהצלחה")
    }
  }, [businessDone, adminDone])

  // עדכון קשרים בין עסק למשתמש - מנהל
  const updateObjects = async () => {
    setError(null)

    const updateAdmin = {
      ...globalContextDetails.user,
      businessId: globalContextDetails.business_global.id,
      business: globalContextDetails.business_global,
      role: 1,
      updateBy: globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName,
    }
    const updateBusiness = {
      ...globalContextDetails.business_global,
      users: [globalContextDetails.user],
      updateBy: globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName,
    }
    globalContextDetails.setUser(updateAdmin)
    globalContextDetails.setBusinessGlobal(updateBusiness)

    try {
      console.log("updateAdmin ", updateAdmin)
      console.log("updateBusiness ", updateBusiness)

      await axios.put<UserDto>(`${url}/api/User/${globalContextDetails.user.id}`, updateAdmin, { withCredentials: true })
      await axios.put<BusinessResponsePutModel>(
        `${url}/api/Business/${globalContextDetails.business_global.id}`,
        updateBusiness,
        { withCredentials: true }
      )

      globalContextDetails.setBusinessGlobal(updateBusiness)
      globalContextDetails.setUser(updateAdmin)
      setSuccess(true)
      setActiveStep(3)
    } catch (e) {
      console.log(e)
      setError("אירעה שגיאה בעדכון הנתונים. אנא נסה שנית.")
    }
  }

  const handleBusinessSuccess = () => {
    setBusinessDone(true)
    setActiveStep((prevStep) => Math.max(prevStep, 2))
  }

  const steps = ["התחלה", "פרטי מנהל", "פרטי עסק", "סיום"]

  return (
    <ThemeProvider theme={theme}>
      <div style={{ marginTop: "65vh" }}></div>

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
          <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="bold" color="primary">
            הגדרת עסק ומנהל
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 4 }} />

          {success ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Check sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom color="success.main" fontWeight="bold">
                הרישום הושלם בהצלחה!
              </Typography>
              <Typography variant="body1" paragraph>
                פרטי העסק והמנהל נשמרו במערכת.
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Box>
                  <Button
                    onClick={() => {
                      setIsAdmin(!isAdmin)
                      if (!isAdmin) setActiveStep(1)
                    }}
                    variant={isAdmin ? "outlined" : "contained"}
                    startIcon={<Person />}
                    fullWidth
                    size="large"
                    sx={{ mb: isAdmin ? 2 : 0 }}
                  >
                    {isAdmin ? "סגור טופס רישום מנהל" : "רישום פרטי מנהל"}
                  </Button>

                  {isAdmin && <AdminRegister />}
                </Box>

                <Box>
                  <Button
                    onClick={() => {
                      setIsBusiness(!isBusiness)
                      if (!isBusiness && adminDone) setActiveStep(2)
                    }}
                    variant={isBusiness ? "outlined" : "contained"}
                    startIcon={<Business />}
                    fullWidth
                    size="large"
                    sx={{ mb: isBusiness ? 2 : 0 }}
                    disabled={!adminDone}
                  >
                    {isBusiness ? "סגור טופס רישום עסק" : "רישום פרטי עסק"}
                  </Button>

                  {isBusiness && <RegisterBusinessData onSubmitSuccess={handleBusinessSuccess} />}
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}
            </>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default BusinessAndAdmin
