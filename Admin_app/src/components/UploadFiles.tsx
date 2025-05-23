"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  LinearProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
} from "@mui/material"
import { CloudUpload, CheckCircle, Error as ErrorIcon } from "@mui/icons-material"

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
    error: {
      main: "#f44336",
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

const UploadFiles = () => {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const url = import.meta.env.VITE_API_URL

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setMessage(null)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!file) {
      setError("יש לבחור קובץ לפני השליחה")
      return
    }

    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append("fileUpload", file)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const response = await axios.post(`${url}/FileUpload/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        setMessage(response.data.message || "הקובץ הועלה בהצלחה")
        setError(null)
        setUploading(false)
      }, 500)
    } catch (err: any) {
      setProgress(0)
      setUploading(false)
      const msg = err.response?.data || "אירעה שגיאה בהעלאת הקובץ"
      setError(msg.message || msg)
      setMessage(null)
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
            <CloudUpload color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              העלאת קבצים
            </Typography>
            <Typography variant="body1" color="text.secondary">
              בחר קובץ להעלאה למערכת
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
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                border: "2px dashed",
                borderColor: "primary.main",
                borderRadius: 2,
                p: 5,
                width: "100%",
                textAlign: "center",
                bgcolor: "primary.50",
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": {
                  bgcolor: "primary.100",
                },
              }}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".jpg,.png,.pdf,.docx,.txt"
                style={{ display: "none" }}
              />
              <CloudUpload color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                גרור קובץ לכאן או לחץ לבחירת קובץ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                תומך בקבצים מסוג JPG, PNG, PDF, DOCX, TXT
              </Typography>

              {file && (
                <Box sx={{ mt: 2, p: 1, bgcolor: "background.paper", borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Typography>
                </Box>
              )}
            </Box>

            {uploading && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  מעלה... {progress}%
                </Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={!file || uploading}
              startIcon={<CloudUpload />}
              sx={{
                mt: 2,
                py: 1.5,
                px: 4,
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.4)",
              }}
            >
              {uploading ? "מעלה..." : "העלה קובץ"}
            </Button>

            {message && (
              <Alert icon={<CheckCircle fontSize="inherit" />} severity="success" sx={{ width: "100%", mt: 2 }}>
                {message}
              </Alert>
            )}

            {error && (
              <Alert icon={<ErrorIcon fontSize="inherit" />} severity="error" sx={{ width: "100%", mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default UploadFiles
