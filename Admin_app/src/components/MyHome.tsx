"use client"

import { useContext, useEffect, useState } from "react"
import { Typography, Row, Col, Card, Button, Space, Avatar, ConfigProvider } from "antd"
import {
  DashboardOutlined,
  ShopOutlined,
  DollarOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
  TeamOutlined,
  EyeOutlined,
  UploadOutlined,
  RiseOutlined,
  FallOutlined,
  BuildOutlined,
} from "@ant-design/icons"
import { motion, Variants } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
import { globalContext } from "../context/GlobalContext"
import axios from "axios"
import dayjs from "dayjs"
import type { UserDto } from "../models/UserDto"
import { blue, green, orange, purple } from "../App"
import { MonthlyReportResponse } from "../models/MonthlyReportResponse"

const { Title, Text, Paragraph } = Typography

const MyHome = () => {
  const globalContextDetails = useContext(globalContext)
  const url = import.meta.env.VITE_API_URL
  const nav = useNavigate()
  const [incomes, setIcomes] = useState<number>(0)
  const [incomesPrecent, setIcomesPrecent] = useState<number>(0)
  const [expenses, setExpenses] = useState<number>(0)
  const [expensesPrecent, setExpensesPrecent] = useState<number>(0)
  const [userPrecent, setUserPrecent] = useState<number>(0)
  const users = globalContextDetails.usersCount || 0
  const [monthlyReport, setMonthlyReport] = useState<number | null>(null)

  const navigate = useNavigate()

  // רספונסיביות מתקדמת
  const isSmallMobile = useMediaQuery({ maxWidth: 479 })
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
  const isDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1439 })

  // פונקציות עזר לגדלים
  const getContainerPadding = () => {
    if (isSmallMobile) return "20px 12px"
    if (isMobile) return "30px 16px"
    if (isTablet) return "40px 24px"
    if (isDesktop) return "50px 32px"
    return "60px 40px"
  }

  const getHeroFontSize = () => {
    if (isSmallMobile) return { h1: "2rem", h2: "1.2rem", p: 14 }
    if (isMobile) return { h1: "2.5rem", h2: "1.5rem", p: 16 }
    if (isTablet) return { h1: "3rem", h2: "1.8rem", p: 18 }
    if (isDesktop) return { h1: "3.5rem", h2: "2.2rem", p: 20 }
    return { h1: "4rem", h2: "2.4rem", p: 22 }
  }

  const getButtonSize = () => {
    if (isSmallMobile) return { height: 48, padding: "0 24px", fontSize: 14 }
    if (isMobile) return { height: 56, padding: "0 32px", fontSize: 16 }
    if (isTablet) return { height: 64, padding: "0 40px", fontSize: 18 }
    return { height: 70, padding: "0 50px", fontSize: 20 }
  }

  const getHeroImageSize = () => {
    if (isSmallMobile) return { width: "100%", maxWidth: 300, height: 250 }
    if (isMobile) return { width: "100%", maxWidth: 400, height: 300 }
    if (isTablet) return { width: "100%", maxWidth: 500, height: 400 }
    return { width: "100%", maxWidth: 600, height: 500 }
  }

  const menuItems = [
    {
      title: "לוח בקרה",
      icon: <DashboardOutlined style={{ fontSize: isMobile ? 24 : 32, color: "#667eea" }} />,
      description: "צפה בנתונים עדכניים של העסק שלך",
      path: "/view-data",
      color: "#667eea",
    },
    {
      title: "פרטי העסק",
      icon: <ShopOutlined style={{ fontSize: isMobile ? 24 : 32, color: green }} />,
      description: " אין לך עדיין עסק? בוא נקים אותו יחד:)",
      path: "/register-admin&business",
      color: green,
    },
    {
      title: "הוספת תנועה בחשבון",
      icon: <DollarOutlined style={{ fontSize: isMobile ? 24 : 32, color: orange }} />,
      description: "נהל תנועות שונות בחשבון שלך",
      path: "/account-transactions",
      color: orange,
    },
    {
      title: "דוחות",
      icon: <BarChartOutlined style={{ fontSize: isMobile ? 24 : 32, color: purple }} />,
      description: "צפה בדוחות ביצועים ותחזיות",
      path: "/production-reports",
      color: purple,
    },
  ]

  const quickActions = [
    { title: "צפייה בנתונים", icon: <EyeOutlined />, path: "/view-data" },
    { title: "העלאת קבצים", icon: <UploadOutlined />, path: "/upload-file" },
    { title: "ניהול משתמשים", icon: <TeamOutlined />, path: "/user-management" },
  ]

  const statsData = [
    {
      title: "הכנסות החודש",
      value: incomes,
      prefix: "₪",
      trend: incomesPrecent,
      color: green,
      icon: <DollarOutlined />,
    },
    {
      title: "משתמשים פעילים",
      value: users,
      trend: userPrecent,
      color: blue,
      icon: <TeamOutlined />,
    },
    {
      title: "מדד חודשי",
      value: monthlyReport ?? 0,
      suffix: "%",
      trend: incomesPrecent,
      color: purple,
      icon: <RiseOutlined />,
    },
    {
      title: "הוצאות החודש",
      value: expenses,
      trend: expensesPrecent,
      color: orange,
      icon: <BarChartOutlined />,
    },
  ]

  const fetchUserGrowthPercent = async (businessId: number): Promise<number> => {
    try {
      const response = await axios.get<UserDto[]>(`${url}/api/User/users-by-business/${businessId}`)
      const users = response.data

      const now = dayjs()
      const currentMonth = now.month()
      const currentYear = now.year()
      const lastMonth = now.subtract(1, "month").month()
      const lastMonthYear = now.subtract(1, "month").year()

      const usersThisMonth = users.filter((user) => {
        const created = dayjs(user.createdAt)
        return created.month() === currentMonth && created.year() === currentYear
      })

      const usersLastMonth = users.filter((user) => {
        const created = dayjs(user.createdAt)
        return created.month() === lastMonth && created.year() === lastMonthYear
      })

      const countThisMonth = usersThisMonth.length
      const countLastMonth = usersLastMonth.length

      if (countLastMonth === 0) {
        return countThisMonth > 0 ? 100 : 0
      }

      const percentGrowth = ((countThisMonth - countLastMonth) / countLastMonth) * 100
      return Math.round(percentGrowth)
    } catch (error) {
      console.error("שגיאה בעת שליפת המשתמשים:", error)
      return 0
    }
  }

  useEffect(() => {
    const fetchMonthlyReport = async () => {
      try {
        const businessId = globalContextDetails.business_global.id
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1

        const res = await axios.get<MonthlyReportResponse>(`${url}/api/Reports/monthly?businessId=${businessId}&year=${year}&month=${month}`)
        setMonthlyReport(res.data?.monthlyMetric ?? 0)
        setIcomes(res.data?.currentMonthIncome ?? 0)
        setIcomesPrecent(res.data?.incomeChangePercent ?? 0)
        setExpenses(res.data?.currentMonthExpenses ?? 0)
        setExpensesPrecent(res.data?.expensesChangePercent ?? 0)
        setUserPrecent(await fetchUserGrowthPercent(businessId))
      } catch (err) {
        console.error("שגיאה בקבלת דוח חודשי:", err)
        setMonthlyReport(0)
      }
    }

    if (globalContextDetails.business_global?.id) {
      fetchMonthlyReport()
    }
  }, [globalContextDetails.business_global?.id])

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  const buttonHoverVariants: Variants = {
    rest: {
      scale: 1,
      y: 0,
    },
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.98,
      y: 0,
    },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const glowVariants = {
    rest: {
      boxShadow: "0 0 0 rgba(102, 126, 234, 0)",
    },
    hover: {
      boxShadow: "0 0 20px rgba(102, 126, 234, 0.3)",
      transition: {
        duration: 0.3,
      },
    },
  }

  const fonts = getHeroFontSize()
  const buttonConfig = getButtonSize()
  const heroImage = getHeroImageSize()

  const floatingVariants = {
    animate: {
      y: [0, -10],
      rotate: [0, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as const,
      },
    },
  }

  return (
    <ConfigProvider direction="rtl">
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.1,
              ease: "easeInOut",
            },
          },
        }}
        initial="hidden"
        animate="show"
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Hero Section - Full Screen */}
        <motion.div
          className="hero-section"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
                ease: "easeInOut",
              },
            },
          }}
          initial="hidden"
          animate="show"
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg,purple 0%,#6878e2  100%) ",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: getContainerPadding(),
            position: "relative",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Animated background particles */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
              opacity: 0.3,
            }}
          />

          {/* Floating elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                background: "rgba(255,255,255,0.3)",
                borderRadius: "50%",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.3, 0.8],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse" as const,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}

          <Row
            gutter={[
              isSmallMobile ? 16 : isMobile ? 24 : isTablet ? 32 : 48,
              isSmallMobile ? 16 : isMobile ? 24 : isTablet ? 32 : 48,
            ]}
            align="middle"
            style={{
              width: "100%",
              maxWidth: isSmallMobile ? "100%" : isMobile ? "100%" : isTablet ? "1000px" : "1400px",
              zIndex: 1,
            }}
          >
            <Col xs={24} lg={isMobile ? 24 : 12}>
              <motion.div variants={itemVariants} style={{ textAlign: "center" }}>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: "easeInOut",
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  <Title
                    level={1}
                    style={{
                      color: "white",
                      marginBottom: isSmallMobile ? 16 : isMobile ? 24 : 32,
                      fontSize: fonts.h1,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    <motion.span
                      animate={{
                        textShadow: [
                          "0 4px 20px rgba(0,0,0,0.3)",
                          "0 8px 30px rgba(255,255,255,0.2)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse" as const,
                        ease: "easeInOut",
                      }}
                    >
                      שלום, {globalContextDetails.user?.firstName || "אורח"}
                    </motion.span>
                  </Title>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: "easeInOut",
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  <Title
                    level={2}
                    style={{
                      color: "rgba(255,255,255,0.95)",
                      marginBottom: isSmallMobile ? 20 : isMobile ? 30 : 40,
                      fontWeight: 300,
                      fontSize: fonts.h2,
                      lineHeight: 1.4,
                    }}
                  >
                    ברוכים הבאים למערכת BusinessMan
                  </Title>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: "easeInOut",
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.6 }}
                >
                  <Paragraph
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: fonts.p,
                      marginBottom: isSmallMobile ? 32 : isMobile ? 40 : 60,
                      lineHeight: 1.7,
                      maxWidth: isSmallMobile ? "280px" : isMobile ? "400px" : "600px",
                      margin: `0 auto ${isSmallMobile ? 32 : isMobile ? 40 : 60}px auto`,
                    }}
                  >
                    הדרך החכמה לנהל את העסק שלך - כלים מתקדמים לניהול הכנסות, הוצאות ודוחות
                  </Paragraph>
                </motion.div>

                <motion.div
                  variants={staggerChildren}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.8 }}
                >
                  <Space
                    size={isMobile ? "middle" : "large"}
                    wrap
                    style={{ justifyContent: "center" }}
                    direction={isSmallMobile ? "vertical" : "horizontal"}
                  >
                    <motion.div
                      variants={{
                        ...buttonHoverVariants,
                        ...glowVariants,
                      }}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate("/view-data")}
                        style={{
                          height: buttonConfig.height,
                          padding: buttonConfig.padding,
                          background: "rgba(255,255,255,0.2)",
                          borderColor: "rgba(255,255,255,0.4)",
                          color: "white",
                          fontWeight: 600,
                          fontSize: buttonConfig.fontSize,
                          borderRadius: buttonConfig.height / 2,
                          backdropFilter: "blur(10px)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                          minWidth: isSmallMobile ? "200px" : "auto",
                        }}
                      >
                        צפה בנתוני העסק
                      </Button>
                    </motion.div>
                    <motion.div
                      variants={buttonHoverVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        size="large"
                        onClick={() => navigate("/account-transactions")}
                        style={{
                          height: buttonConfig.height,
                          padding: buttonConfig.padding,
                          background: orange,
                          borderColor: orange,
                          color: "white",
                          fontWeight: 600,
                          fontSize: buttonConfig.fontSize,
                          borderRadius: buttonConfig.height / 2,
                          boxShadow: "0 8px 32px rgba(250,140,22,0.3)",
                          minWidth: isSmallMobile ? "200px" : "auto",
                        }}
                      >
                        נהל תנועות בעסק
                      </Button>
                    </motion.div>
                  </Space>
                </motion.div>
              </motion.div>
            </Col>
            {!isMobile && (
              <Col xs={24} lg={12} style={{ textAlign: "center" }}>
                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      rotate: [-2, 2],
                      transition: {
                        type: "tween",
                        duration: 0.5,
                        repeatType: "reverse" as const,
                      }
                    }}
                    style={{
                      width: "100%",
                      maxWidth: heroImage.maxWidth,
                      height: heroImage.height,
                      background: "rgba(255,255,255,0.15)",
                      borderRadius: isTablet ? 30 : 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(20px)",
                      border: "2px solid rgba(255,255,255,0.3)",
                      margin: "0 auto",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 5],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse" as const,
                        ease: "easeInOut",
                      }}
                    >
                      <BuildOutlined
                        style={{
                          fontSize: isTablet ? 120 : isDesktop ? 160 : 200,
                          color: "rgba(255,255,255,0.9)",
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Col>
            )}
          </Row>
        </motion.div>

        {/* Stats Section - Full Screen */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
                ease: "easeInOut",
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: getContainerPadding(),
            background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ width: "100%", maxWidth: isTablet ? "900px" : "1400px" }}>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: 30,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: "easeInOut",
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              style={{ textAlign: "center", marginBottom: isSmallMobile ? 40 : isMobile ? 60 : 80 }}
            >
              <Title
                level={1}
                style={{
                  marginBottom: isSmallMobile ? 16 : 24,
                  fontSize: isSmallMobile ? "2rem" : isMobile ? "2.5rem" : isTablet ? "3rem" : "3.5rem",
                  color: "#1a202c",
                  fontWeight: 700,
                }}
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse" as const,
                    ease: "linear",
                  }}
                  style={{
                    background: "linear-gradient(90deg, #1a202c, #667eea, #1a202c)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  סטטיסטיקות העסק
                </motion.span>
              </Title>
              <Text
                style={{
                  fontSize: isSmallMobile ? 16 : isMobile ? 18 : 20,
                  color: "#4a5568",
                  display: "block",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                מבט כללי על ביצועי העסק שלך החודש
              </Text>
            </motion.div>

            <Row
              gutter={[
                isSmallMobile ? 12 : isMobile ? 16 : isTablet ? 24 : 40,
                isSmallMobile ? 12 : isMobile ? 16 : isTablet ? 24 : 40,
              ]}
              justify="center"
            >
              {statsData.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      variants={{
                        rest: {
                          scale: 1,
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          y: 0,
                        },
                        hover: {
                          scale: 1.03,
                          y: -5,
                          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.15)",
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            mass: 0.8,
                          },
                        },
                      }}
                      initial="rest"
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        style={{
                          borderRadius: isSmallMobile ? "20px" : isMobile ? "24px" : "32px",
                          border: "none",
                          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
                          background: "white",
                          overflow: "hidden",
                          position: "relative",
                          height: "100%",
                          minHeight: isSmallMobile ? "220px" : isMobile ? "260px" : "300px", // שונה כאן
                        }}
                        styles={{
                          body: {
                            padding: isSmallMobile ? "20px 16px" : isMobile ? "30px 20px" : "40px 24px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start", // שונה כאן
                            alignItems: "center",
                            textAlign: "center",
                            position: "relative",
                          },
                        }}
                      >
                        {/* פס עליון צבעוני */}
                        <motion.div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "6px",
                            background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                          }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        />

                        {/* אייקון בעיגול */}
                        <motion.div
                          whileHover={{
                            scale: 1.1,
                            rotate: [-10, 10],
                            transition: {
                              type: "tween",
                              duration: 0.5,
                              repeatType: "reverse" as const,
                            },
                          }}
                          style={{
                            marginTop: isSmallMobile ? 16 : 24, // הוזז למטה
                            zIndex: 1,
                          }}
                        >
                          <Avatar
                            size={isSmallMobile ? 60 : isMobile ? 80 : 100}
                            style={{
                              background: `${stat.color}15`,
                              color: stat.color,
                              marginBottom: isSmallMobile ? 12 : isMobile ? 16 : 24,
                              border: `3px solid ${stat.color}30`,
                            }}
                          >
                            <div style={{ fontSize: isSmallMobile ? 24 : isMobile ? 32 : 40 }}>{stat.icon}</div>
                          </Avatar>
                        </motion.div>

                        {/* כותרת */}
                        <Title
                          level={isSmallMobile ? 5 : 4}
                          style={{
                            color: "#2d3748",
                            marginBottom: isSmallMobile ? 8 : 16,
                            fontSize: isSmallMobile ? 12 : isMobile ? 14 : 16,
                            fontWeight: 500,
                            textAlign: "center",
                          }}
                        >
                          {stat.title}
                        </Title>

                        {/* ערך */}
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                          viewport={{ once: true }}
                          style={{
                            color: stat.color,
                            fontSize: isSmallMobile ? "1.8rem" : isMobile ? "2.2rem" : "2.8rem",
                            fontWeight: "bold",
                            marginBottom: isSmallMobile ? 8 : 16,
                            lineHeight: 1,
                          }}
                        >
                          <motion.span
                            animate={{
                              textShadow: [
                                "0 0 0 transparent",
                                `0 0 10px ${stat.color}40`,
                              ],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse" as const,
                              delay: index * 0.5,
                            }}
                          >
                            {stat.prefix}
                            {stat.value}
                            {stat.suffix}
                          </motion.span>
                        </motion.div>

                        {/* טרנד */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.6 }}
                          viewport={{ once: true }}
                        >
                          <motion.div
                            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <motion.div
                              animate={{
                                y: [0, -3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse" as const,
                                delay: index * 0.3,
                              }}
                            >
                              {stat.trend > 0 ? (
                                <RiseOutlined
                                  style={{
                                    color: "#48bb78",
                                    marginLeft: 8,
                                    fontSize: isSmallMobile ? 16 : 20,
                                  }}
                                />
                              ) : (
                                <FallOutlined
                                  style={{
                                    color: "#f56565",
                                    marginLeft: 8,
                                    fontSize: isSmallMobile ? 16 : 20,
                                  }}
                                />
                              )}
                            </motion.div>
                            <Text
                              style={{
                                color: stat.trend > 0 ? "#48bb78" : "#f56565",
                                fontWeight: 600,
                                fontSize: isSmallMobile ? 14 : isMobile ? 16 : 18,
                              }}
                            >
                              {stat.trend > 0 ? "+" : ""}
                              {stat.trend}%
                            </Text>
                          </motion.div>
                        </motion.div>
                      </Card>

                    </motion.div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.div>

        {/* Quick Actions - Full Screen */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
                ease: "easeInOut",
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: getContainerPadding(),
            background: "white",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ width: "100%", maxWidth: isSmallMobile ? "100%" : isMobile ? "600px" : "800px" }}>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: 30,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: "easeInOut",
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <Title
                level={2}
                style={{
                  textAlign: "center",
                  marginBottom: isSmallMobile ? 40 : isMobile ? 50 : 60,
                  fontSize: isSmallMobile ? "1.5rem" : isMobile ? "2rem" : "2.5rem",
                  color: "#2d3748",
                }}
              >
                <motion.span
                  animate={{
                    color: ["#2d3748", "#667eea"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse" as const,
                    ease: "easeInOut",
                  }}
                >
                  פעולות מהירות
                </motion.span>
              </Title>
            </motion.div>

            <Row gutter={[isSmallMobile ? 12 : isMobile ? 16 : 24, isSmallMobile ? 12 : isMobile ? 16 : 24]}>
              {quickActions.map((action, index) => (
                <Col xs={24} sm={isSmallMobile ? 24 : 8} key={index}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <motion.div
                      variants={buttonHoverVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        type="default"
                        size="large"
                        icon={action.icon}
                        onClick={() => navigate(action.path)}
                        block
                        style={{
                          height: isSmallMobile ? "80px" : isMobile ? "100px" : "120px",
                          borderRadius: isSmallMobile ? 16 : 20,
                          borderWidth: 2,
                          fontWeight: 600,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: isSmallMobile ? 14 : isMobile ? 16 : 18,
                          gap: isSmallMobile ? 8 : 12,
                        }}
                      >
                        <motion.div
                          initial={{ y: 5 }}
                          whileHover={{
                            y: 0,
                            rotate: [-5, 5],
                            transition: {
                              type: "tween",
                              duration: 0.5,
                              repeatType: "reverse" as const,
                            }
                          }}
                        >
                          <motion.div
                            style={{ fontSize: isSmallMobile ? 24 : isMobile ? 28 : 32 }}
                            animate={{
                              scale: [1, 1.1],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse" as const,
                              delay: index * 0.5,
                            }}
                          >
                            {action.icon}
                          </motion.div>
                          {action.title}
                        </motion.div>
                      </Button>
                    </motion.div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.div>

        {/* Main Menu Cards - Full Screen */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
                ease: "easeInOut",
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: getContainerPadding(),
            background: "#f8fafc",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ width: "100%", maxWidth: isTablet ? "900px" : "1200px", height: "100%" }}>
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              style={{ textAlign: "center", marginBottom: isSmallMobile ? 40 : isMobile ? 50 : 60 }}
            >
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 30,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.8,
                      ease: "easeInOut",
                    },
                  },
                }}
              >
                <Title
                  level={2}
                  style={{
                    marginBottom: 16,
                    fontSize: isSmallMobile ? "1.5rem" : isMobile ? "2rem" : "2.5rem",
                    color: "#2d3748",
                  }}
                >
                  ניהול העסק שלך
                </Title>
              </motion.div>
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 30,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.8,
                      ease: "easeInOut",
                    },
                  },
                }}
              >
                <Text
                  type="secondary"
                  style={{
                    fontSize: isSmallMobile ? 14 : isMobile ? 16 : 18,
                    display: "block",
                    maxWidth: "600px",
                    margin: "0 auto",
                    lineHeight: 1.6,
                  }}
                >
                  כל הכלים שאתה צריך לניהול יעיל ומוצלח של העסק שלך במקום אחד
                </Text>
              </motion.div>
            </motion.div>

            <Row
              gutter={[
                isSmallMobile ? 16 : isMobile ? 20 : isTablet ? 24 : 32,
                isSmallMobile ? 16 : isMobile ? 20 : isTablet ? 24 : 32,
              ]}
            >
              {menuItems.map((item, index) => (
                <Col xs={24} sm={isSmallMobile ? 24 : 12} lg={isTablet ? 12 : 6} key={index}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.15 }}
                    style={{ height: "100%" }}
                  >
                    <motion.div
                      variants={{
                        rest: {
                          scale: 1,
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          y: 0,
                        },
                        hover: {
                          scale: 1.03,
                          y: -5,
                          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.15)",
                          transition: {
                            type: "spring" as const,
                            stiffness: 400,
                            damping: 25,
                            mass: 0.8,
                          },
                        },
                      }}
                      initial="rest"
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                      style={{ height: "100%" }}
                    >
                      <Card
                        className="feature-card"
                        hoverable
                        style={{
                          height: "100%",
                          minHeight: isSmallMobile ? "200px" : isMobile ? "240px" : "280px",
                          borderRadius: isSmallMobile ? "16px" : "24px",
                          border: "none",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                          background: "white",
                          overflow: "hidden",
                          position: "relative",
                        }}
                        styles={{
                          body: {
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: isSmallMobile ? "16px" : isMobile ? "20px" : "24px",
                          }
                        }}
                      >
                        {/* Animated border gradient */}
                        <motion.div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "3px",
                            background: `linear-gradient(90deg, ${item.color}, transparent, ${item.color})`,
                          }}
                          animate={{
                            background: [
                              `linear-gradient(90deg, ${item.color}, transparent, ${item.color})`,
                              `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                            ],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse" as const,
                            delay: index * 0.5,
                          }}
                        />

                        <div>
                          <motion.div
                            className="icon-wrapper"
                            whileHover={{
                              rotate: [-10, 10],
                              scale: 1.1,
                              transition: {
                                type: "tween",
                                duration: 0.5,
                                repeatType: "reverse" as const,
                              }
                            }}
                            style={{
                              background: `${item.color}20`,
                              color: item.color,
                              width: isSmallMobile ? "60px" : isMobile ? "70px" : "80px",
                              height: isSmallMobile ? "60px" : isMobile ? "70px" : "80px",
                              borderRadius: isSmallMobile ? "16px" : "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: isSmallMobile ? "16px" : "24px",
                              fontSize: isSmallMobile ? "30px" : isMobile ? "35px" : "40px",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <motion.div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `linear-gradient(45deg, transparent, ${item.color}30, transparent)`,
                              }}
                              animate={{
                                x: ["-100%", "100%"],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.3,
                                ease: "linear",
                              }}
                            />
                            <motion.div
                              animate={{
                                rotate: [0, 5],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                repeatType: "reverse" as const,
                                delay: index * 0.2,
                              }}
                            >
                              {item.icon}
                            </motion.div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            viewport={{ once: true }}
                          >
                            <Title level={isSmallMobile ? 5 : 4}>{item.title}</Title>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                            viewport={{ once: true }}
                          >
                            <Paragraph type="secondary">{item.description}</Paragraph>
                          </motion.div>
                        </div>

                        <motion.div
                          variants={buttonHoverVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button
                            type="primary"
                            icon={
                              <motion.div
                                animate={{
                                  x: [0, 3],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: "reverse" as const,
                                  delay: index * 0.2,
                                }}
                              >
                                <ArrowRightOutlined />
                              </motion.div>
                            }
                            onClick={() => navigate(item.path)}
                            style={{
                              height: isSmallMobile ? 40 : 50,
                              background: item.color,
                              borderColor: item.color,
                              fontWeight: 600,
                              fontSize: isSmallMobile ? 14 : 16,
                              position: "relative",
                              overflow: "hidden",
                            }}
                            block
                          >
                            <motion.div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "rgba(255,255,255,0.2)",
                                transform: "translateX(-100%)",
                              }}
                              whileHover={{
                                transform: "translateX(100%)",
                              }}
                              transition={{
                                duration: 0.6,
                              }}
                            />
                            כניסה
                          </Button>
                        </motion.div>
                      </Card>
                    </motion.div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </motion.div>

        {/* Testimonial & Footer - Full Screen */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
                ease: "easeInOut",
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: getContainerPadding(),
            background: "white",
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: isTablet ? "800px" : "1000px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              >
                <Card
                  className="testimonial-section"
                  style={{
                    background: "linear-gradient(135deg, #f7f9fc 0%, #eef2f7 100%)",
                    border: "none",
                    borderRadius: isSmallMobile ? "20px" : "30px",
                    marginBottom: isSmallMobile ? 40 : 60,
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  styles={{
                    body: {
                      padding: isSmallMobile ? "30px 20px" : isMobile ? "40px 30px" : "60px",
                    }
                  }}
                >
                  {/* Animated background elements */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        position: "absolute",
                        width: 100,
                        height: 100,
                        background: `radial-gradient(circle, ${i === 0 ? "#667eea" : i === 1 ? green : orange}20, transparent)`,
                        borderRadius: "50%",
                        top: `${20 + i * 30}%`,
                        right: `${10 + i * 20}%`,
                      }}
                      animate={{
                        scale: [1, 1.2],
                        opacity: [0.3, 0.6],
                      }}
                      transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        repeatType: "reverse" as const,
                        delay: i * 0.5,
                      }}
                    />
                  ))}

                  <Row gutter={[isSmallMobile ? 16 : 32, isSmallMobile ? 16 : 32]} align="middle">
                    <Col xs={24} lg={isSmallMobile ? 24 : 16}>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: -50 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.8, ease: "easeInOut" },
                          },
                        }}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                      >
                        <Title
                          level={3}
                          style={{
                            color: "#667eea",
                            marginBottom: isSmallMobile ? 16 : 24,
                            fontSize: isSmallMobile ? "1.2rem" : isMobile ? "1.5rem" : "2rem",
                            textAlign: isMobile ? "center" : "right",
                            lineHeight: 1.4,
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          <motion.span
                            animate={{
                              textShadow: [
                                "0 0 0 transparent",
                                "0 0 20px rgba(102, 126, 234, 0.3)",
                              ],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              repeatType: "reverse" as const,
                            }}
                          >
                            "מערכת BusinessMan שינתה את הדרך שבה אני מנהל את העסק שלי. הכל נגיש ויעיל."
                          </motion.span>
                        </Title>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: isSmallMobile ? 14 : 16,
                            display: "block",
                            textAlign: isMobile ? "center" : "right",
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          יוסי כהן, בעלים של "טכנולוגיות מתקדמות" בע״מ
                        </Text>
                      </motion.div>
                    </Col>
                    <Col xs={24} lg={isSmallMobile ? 24 : 8} style={{ textAlign: "center" }}>
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: 50 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.8, ease: "easeInOut" },
                          },
                        }}
                        initial="hidden"
                        whileInView="visible"
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          variants={buttonHoverVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate("/register-admin&business")}
                            style={{
                              height: isSmallMobile ? 48 : 60,
                              padding: isSmallMobile ? "0 24px" : "0 40px",
                              fontWeight: 600,
                              marginBottom: 16,
                              fontSize: isSmallMobile ? 16 : 18,
                              position: "relative",
                              zIndex: 1,
                              overflow: "hidden",
                            }}
                            block={isMobile}
                          >
                            <motion.div
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                                transform: "translateX(-100%)",
                              }}
                              animate={{
                                transform: ["translateX(-100%)", "translateX(100%)"],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3,
                              }}
                            />
                            הצטרף עכשיו
                          </Button>
                        </motion.div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        viewport={{ once: true }}
                      >
                        <Text
                          type="secondary"
                          style={{
                            fontSize: isSmallMobile ? 12 : 14,
                            display: "block",
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          הצטרפו למאות עסקים שכבר משתמשים במערכת
                        </Text>
                      </motion.div>
                    </Col>
                  </Row>
                </Card>
              </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.div
              style={{ borderTop: "1px solid #f0f0f0", paddingTop: isSmallMobile ? 30 : 40 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={isMobile ? 24 : 12}>
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <Space
                      style={{
                        width: "100%",
                        justifyContent: isMobile ? "center" : "flex-start",
                        flexDirection: isSmallMobile ? "column" : "row",
                      }}
                    >
                      <motion.div
                        whileHover={{
                          rotate: [0, 10, -10, 0],
                          scale: 1.1,
                        }}
                        transition={{
                          type: "tween",
                          duration: 0.5
                        }}
                      >
                        <Avatar
                          size={isSmallMobile ? 40 : 48}
                          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                        >
                          <DashboardOutlined />
                        </Avatar>
                      </motion.div>
                      <div style={{ textAlign: isMobile ? "center" : "right" }}>
                        <Title
                          level={4}
                          style={{
                            margin: 0,
                            color: "#667eea",
                            fontSize: isSmallMobile ? "1.2rem" : "1.5rem",
                          }}
                        >
                          <motion.span
                            animate={{
                              backgroundPosition: ["0% 50%", "100% 50%"],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse" as const,
                              ease: "linear",
                            }}
                            style={{
                              background: "linear-gradient(90deg, #667eea, #764ba2, #667eea)",
                              backgroundSize: "200% 100%",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            BusinessMan
                          </motion.span>
                        </Title>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: isSmallMobile ? 12 : 14,
                          }}
                        >
                          © 2025 BusinessMan. כל הזכויות שמורות.
                        </Text>
                      </div>
                    </Space>
                  </motion.div>
                </Col>
                <Col xs={24} sm={isMobile ? 24 : 12}>
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Space
                      style={{
                        width: "100%",
                        justifyContent: isMobile ? "center" : "flex-end",
                        flexWrap: "wrap",
                      }}
                    >
                      {[
                        { text: "תנאי שימוש", path: "/term-of-service" },
                        { text: "פרטיות", path: "/private-policy" },
                        { text: "צור קשר", path: "/concat-us" },
                      ].map((link) => (
                        <motion.div
                          key={link.text}
                          whileHover={{
                            scale: 1.05,
                            y: -2,
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Button
                            onClick={() => {
                              nav(link.path)
                            }}
                            type="text"
                            size={isSmallMobile ? "middle" : "large"}
                            style={{
                              fontSize: isSmallMobile ? 14 : 16,
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <motion.div
                              style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "2px",
                                background: "#667eea",
                                transform: "scaleX(0)",
                                transformOrigin: "center",
                              }}
                              whileHover={{
                                transform: "scaleX(1)",
                              }}
                              transition={{ duration: 0.3 }}
                            />
                            {link.text}
                          </Button>
                        </motion.div>
                      ))}
                    </Space>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </ConfigProvider>
  )
}

export default MyHome