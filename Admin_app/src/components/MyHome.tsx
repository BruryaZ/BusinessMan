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
        const res = await axios.get(`${url}/api/Reports/monthly?businessId=${businessId}&year=${year}&month=${month}`)
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        stiffness: 100,
        damping: 15,
        duration: 0.6,
      },
    },
  }

  const buttonHoverVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  }

  const fonts = getHeroFontSize()
  const buttonConfig = getButtonSize()
  const heroImage = getHeroImageSize()

  return (
    <ConfigProvider direction="rtl">
      <motion.div
        variants={containerVariants}
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
          variants={containerVariants}
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
          }}
        >
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
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
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
                    שלום, {globalContextDetails.user?.firstName || "אורח"}
                  </Title>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
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
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
                >
                  <Space
                    size={isMobile ? "middle" : "large"}
                    wrap
                    style={{ justifyContent: "center" }}
                    direction={isSmallMobile ? "vertical" : "horizontal"}
                  >
                    <motion.div
                      variants={{
                        rest: { scale: 1 },
                        hover: {
                          scale: 1.05,
                          transition: {
                            type: "spring", // Ensure this matches the expected type
                            stiffness: 400,
                            damping: 10,
                          },
                        },
                        tap: { scale: 0.95 },
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
                    <motion.div variants={buttonHoverVariants as Variants} initial="rest" whileHover="hover" whileTap="tap">
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
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div
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
                    <BuildOutlined
                      style={{
                        fontSize: isTablet ? 120 : isDesktop ? 160 : 200,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    />
                  </div>
                </motion.div>
              </Col>
            )}
          </Row>
        </motion.div>

        {/* Stats Section - Full Screen */}
        <motion.div
          variants={containerVariants}
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
            <div style={{ textAlign: "center", marginBottom: isSmallMobile ? 40 : isMobile ? 60 : 80 }}>
              <Title
                level={1}
                style={{
                  marginBottom: isSmallMobile ? 16 : 24,
                  fontSize: isSmallMobile ? "2rem" : isMobile ? "2.5rem" : isTablet ? "3rem" : "3.5rem",
                  color: "#1a202c",
                  fontWeight: 700,
                }}
              >
                סטטיסטיקות העסק
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
            </div>
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
                  >
                    <motion.div
                      variants={{
                        rest: {
                          scale: 1,
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        },
                        hover: {
                          scale: 1.05,
                          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                          transition: {
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
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
                          minHeight: isSmallMobile ? "180px" : isMobile ? "220px" : "280px",
                        }}
                        bodyStyle={{
                          padding: isSmallMobile ? "20px 16px" : isMobile ? "30px 20px" : "40px 24px",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "6px",
                            background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                          }}
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                          viewport={{ once: true }}
                        >
                          <Avatar
                            size={isSmallMobile ? 60 : isMobile ? 80 : 100}
                            style={{
                              background: `${stat.color}15`,
                              color: stat.color,
                              marginBottom: isSmallMobile ? 16 : isMobile ? 24 : 32,
                              border: `3px solid ${stat.color}30`,
                            }}
                          >
                            <div style={{ fontSize: isSmallMobile ? 24 : isMobile ? 32 : 40 }}>{stat.icon}</div>
                          </Avatar>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                          viewport={{ once: true }}
                        >
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
                        </motion.div>

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
                          {stat.prefix}
                          {stat.value}
                          {stat.suffix}
                        </motion.div>

                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.6 }}
                          viewport={{ once: true }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                          </div>
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
          variants={containerVariants}
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
            <Title
              level={2}
              style={{
                textAlign: "center",
                marginBottom: isSmallMobile ? 40 : isMobile ? 50 : 60,
                fontSize: isSmallMobile ? "1.5rem" : isMobile ? "2rem" : "2.5rem",
                color: "#2d3748",
              }}
            >
              פעולות מהירות
            </Title>
            <Row gutter={[isSmallMobile ? 12 : isMobile ? 16 : 24, isSmallMobile ? 12 : isMobile ? 16 : 24]}>
              {quickActions.map((action, index) => (
                <Col xs={24} sm={isSmallMobile ? 24 : 8} key={index}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div variants={buttonHoverVariants} initial="rest" whileHover="hover" whileTap="tap">
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
                          whileHover={{ y: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div style={{ fontSize: isSmallMobile ? 24 : isMobile ? 28 : 32 }}>{action.icon}</div>
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
          variants={containerVariants}
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
            <div style={{ textAlign: "center", marginBottom: isSmallMobile ? 40 : isMobile ? 50 : 60 }}>
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
            </div>

            <Row gutter={[
              isSmallMobile ? 16 : isMobile ? 20 : isTablet ? 24 : 32,
              isSmallMobile ? 16 : isMobile ? 20 : isTablet ? 24 : 32
            ]}>
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
                        },
                        hover: {
                          scale: 1.05,
                          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          },
                        },
                      }}
                      initial="rest"
                      whileHover="hover"
                      style={{ height: "100%" }}
                      whileTap={{ scale: 0.98 }}
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
                        }}
                        bodyStyle={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: isSmallMobile ? "16px" : isMobile ? "20px" : "24px",
                        }}
                      >
                        <div>
                          <motion.div
                            className="icon-wrapper"
                            whileHover={{
                              rotate: [0, -10, 10, 0],
                              transition: { duration: 0.5 },
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
                            }}
                          >
                            {item.icon}
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

                        <motion.div variants={buttonHoverVariants} initial="rest" whileHover="hover" whileTap="tap">
                          <Button
                            type="primary"
                            icon={<ArrowRightOutlined />}
                            onClick={() => navigate(item.path)}
                            style={{
                              height: isSmallMobile ? 40 : 50,
                              background: item.color,
                              borderColor: item.color,
                              fontWeight: 600,
                              fontSize: isSmallMobile ? 14 : 16,
                            }}
                            block
                          >
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
          variants={containerVariants}
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
              <Card
                className="testimonial-section"
                style={{
                  background: "linear-gradient(135deg, #f7f9fc 0%, #eef2f7 100%)",
                  border: "none",
                  borderRadius: isSmallMobile ? "20px" : "30px",
                  marginBottom: isSmallMobile ? 40 : 60,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
                bodyStyle={{
                  padding: isSmallMobile ? "30px 20px" : isMobile ? "40px 30px" : "60px",
                }}
              >
                <Row gutter={[isSmallMobile ? 16 : 32, isSmallMobile ? 16 : 32]} align="middle">
                  <Col xs={24} lg={isSmallMobile ? 24 : 16}>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
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
                        }}
                      >
                        "מערכת BusinessMan שינתה את הדרך שבה אני מנהל את העסק שלי. הכל נגיש ויעיל."
                      </Title>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: isSmallMobile ? 14 : 16,
                          display: "block",
                          textAlign: isMobile ? "center" : "right",
                        }}
                      >
                        יוסי כהן, בעלים של "טכנולוגיות מתקדמות" בע״מ
                      </Text>
                    </motion.div>
                  </Col>
                  <Col xs={24} lg={isSmallMobile ? 24 : 8} style={{ textAlign: "center" }}>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <motion.div variants={buttonHoverVariants} initial="rest" whileHover="hover" whileTap="tap">
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => navigate("/register-user")}
                          style={{
                            height: isSmallMobile ? 48 : 60,
                            padding: isSmallMobile ? "0 24px" : "0 40px",
                            fontWeight: 600,
                            marginBottom: 16,
                            fontSize: isSmallMobile ? 16 : 18,
                          }}
                          block={isMobile}
                        >
                          הצטרף עכשיו
                        </Button>
                      </motion.div>
                    </motion.div>
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: isSmallMobile ? 12 : 14,
                          display: "block",
                        }}
                      >
                        הצטרפו למאות עסקים שכבר משתמשים במערכת
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </motion.div>

            {/* Footer */}
            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: isSmallMobile ? 30 : 40 }}>
              <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={isMobile ? 24 : 12}>
                  <Space
                    style={{
                      width: "100%",
                      justifyContent: isMobile ? "center" : "flex-start",
                      flexDirection: isSmallMobile ? "column" : "row",
                    }}
                  >
                    <Avatar
                      size={isSmallMobile ? 40 : 48}
                      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                    >
                      <DashboardOutlined />
                    </Avatar>
                    <div style={{ textAlign: isMobile ? "center" : "right" }}>
                      <Title
                        level={4}
                        style={{
                          margin: 0,
                          color: "#667eea",
                          fontSize: isSmallMobile ? "1.2rem" : "1.5rem",
                        }}
                      >
                        BusinessMan
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
                </Col>
                <Col xs={24} sm={isMobile ? 24 : 12}>
                  <Space
                    style={{
                      width: "100%",
                      justifyContent: isMobile ? "center" : "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      onClick={() => {
                        nav("/term-of-service")
                      }}
                      type="text"
                      size={isSmallMobile ? "middle" : "large"}
                      style={{ fontSize: isSmallMobile ? 14 : 16 }}
                    >
                      תנאי שימוש
                    </Button>
                    <Button
                      onClick={() => {
                        nav("/private-policy")
                      }}
                      type="text"
                      size={isSmallMobile ? "middle" : "large"}
                      style={{ fontSize: isSmallMobile ? 14 : 16 }}
                    >
                      פרטיות
                    </Button>
                    <Button
                      onClick={() => {
                        nav("/concat-us")
                      }}
                      type="text"
                      size={isSmallMobile ? "middle" : "large"}
                      style={{ fontSize: isSmallMobile ? 14 : 16 }}
                    >
                      צור קשר
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </ConfigProvider >
  )
}

export default MyHome
