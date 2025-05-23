import type React from "react"
import type { Business } from "../models/Business"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material"

interface BusinessTableProps {
  business: Business
}

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
    background: {
      default: "#f5f5f5",
    },
  },
})

const BusinessTable: React.FC<BusinessTableProps> = ({ business }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <Typography variant="h6" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
          פרטי העסק
        </Typography>

        <TableContainer component={Paper} sx={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="business data table">
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                  מזהה
                </TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                  שם עסק
                </TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                  כתובת
                </TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                  אימייל
                </TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                  סוג עסק
                </TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                  הכנסות
                </TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                  הוצאות
                </TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                  תזרים מזומנים
                </TableCell>
                <TableCell align="right" sx={{ color: "white", fontWeight: "bold" }}>
                  שווי נקי
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell align="right">{business.id}</TableCell>
                <TableCell align="right">{business.name}</TableCell>
                <TableCell align="right">{business.address}</TableCell>
                <TableCell align="right">{business.email}</TableCell>
                <TableCell align="right">{business.businessType}</TableCell>
                <TableCell align="right">₪{business.income?.toLocaleString()}</TableCell>
                <TableCell align="right">₪{business.expenses?.toLocaleString()}</TableCell>
                <TableCell align="right">₪{business.cashFlow?.toLocaleString()}</TableCell>
                <TableCell align="right">₪{business.netWorth?.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  )
}

export default BusinessTable
