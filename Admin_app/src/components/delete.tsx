// import type React from "react"
// import { createTheme, ThemeProvider } from "@mui/material/styles"
// import CssBaseline from "@mui/material/CssBaseline"
// import rtlPlugin from "stylis-plugin-rtl"
// import { prefixer } from "stylis"
// import { CacheProvider } from "@emotion/react"
// import createCache from "@emotion/cache"

// // Create rtl cache
// const cacheRtl = createCache({
//   key: "muirtl",
//   stylisPlugins: [prefixer, rtlPlugin],
// })

// // Define font family
// const heeboFontFamily = '"Heebo", "Roboto", "Helvetica", "Arial", sans-serif'

// // Create a theme instance with modern styling
// const theme = createTheme({
//   direction: "rtl",
//   typography: {
//     fontFamily: heeboFontFamily,
//     h1: {
//       fontWeight: 700,
//     },
//     h2: {
//       fontWeight: 700,
//     },
//     h3: {
//       fontWeight: 600,
//     },
//     h4: {
//       fontWeight: 600,
//     },
//     h5: {
//       fontWeight: 500,
//     },
//     h6: {
//       fontWeight: 500,
//     },
//     button: {
//       fontWeight: 500,
//       textTransform: "none",
//     },
//   },
//   palette: {
//     primary: {
//       main: "#5569ff", // Modern blue with a hint of purple
//       light: "#8c9eff",
//       dark: "#303f9f",
//     },
//     secondary: {
//       main: "#ff4081", // Vibrant pink
//       light: "#ff79b0",
//       dark: "#c60055",
//     },
//     background: {
//       default: "#f8f9fa",
//       paper: "#ffffff",
//     },
//     error: {
//       main: "#f44336",
//     },
//     warning: {
//       main: "#ff9800",
//     },
//     info: {
//       main: "#03a9f4",
//     },
//     success: {
//       main: "#4caf50",
//     },
//   },
//   shape: {
//     borderRadius: 12,
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           textTransform: "none",
//           fontWeight: 600,
//           padding: "10px 20px",
//           boxShadow: "none",
//           "&:hover": {
//             boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
//           },
//         },
//         contained: {
//           boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//           overflow: "hidden",
//           transition: "transform 0.2s, box-shadow 0.2s",
//           "&:hover": {
//             boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
//           },
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//         },
//         elevation1: {
//           boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
//         },
//         elevation2: {
//           boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           "& .MuiOutlinedInput-root": {
//             borderRadius: 12,
//           },
//         },
//       },
//     },
//     MuiChip: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           fontWeight: 500,
//         },
//       },
//     },
//     MuiAvatar: {
//       styleOverrides: {
//         root: {
//           fontWeight: 600,
//         },
//       },
//     },
//     MuiTableCell: {
//       styleOverrides: {
//         root: {
//           padding: "16px",
//         },
//         head: {
//           fontWeight: 600,
//           backgroundColor: "rgba(0, 0, 0, 0.02)",
//         },
//       },
//     },
//     MuiTab: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           fontWeight: 500,
//           minWidth: 100,
//         },
//       },
//     },
//     MuiAlert: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//         },
//       },
//     },
//     MuiListItemButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//         },
//       },
//     },
//   },
// })

// export function ThemeRegistry({ children }: { children: React.ReactNode }) {
//   return (
//     <CacheProvider value={cacheRtl}>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </CacheProvider>
//   )
// }