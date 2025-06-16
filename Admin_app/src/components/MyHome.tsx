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
import { motion } from "framer-motion"
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
  const nav = useNavigate()
  const [incomes, setIcomes] = useState<number>(0)
  const [incomesPrecent, setIcomesPrecent] = useState<number>(0)
  const [expenses, setExpenses] = useState<number>(0)
  const [expensesPrecent, setExpensesPrecent] = useState<number>(0)
  const [userPrecent, setUserPrecent] = useState<number>(0)
  const users = globalContextDetails.usersCount || 0
  const [monthlyReport, setMonthlyReport] = useState<number | null>(null)

  const navigate = useNavigate()
  const isMobile = useMediaQuery({ maxWidth: 768 })

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
      const response = await axios.get<UserDto[]>(`https://localhost:7031/api/User/users-by-business/${businessId}`)
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
        const res = await axios.get(
          `https://localhost:7031/api/Reports/monthly?businessId=${businessId}&year=${year}&month=${month}`,
        )
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
        staggerChildren: 0.2,
      },
    },
  }

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
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg,purple 0%,#6878e2  100%) ",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 40px",
            position: "relative",
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
          <Row gutter={[48, 48]} align="middle" style={{ width: "100%", maxWidth: "1400px", zIndex: 1 }}>
            <Col xs={24} lg={12}>
              <motion.div variants={containerVariants} style={{ textAlign: "center" }}>
                <Title
                  level={1}
                  style={{
                    color: "white",
                    marginBottom: 32,
                    fontSize: isMobile ? "3rem" : "4rem",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  שלום, {globalContextDetails.user?.firstName || "אורח"}
                </Title>
                <Title
                  level={2}
                  style={{
                    color: "rgba(255,255,255,0.95)",
                    marginBottom: 40,
                    fontWeight: 300,
                    fontSize: isMobile ? "1.8rem" : "2.4rem",
                    lineHeight: 1.4,
                  }}
                >
                  ברוכים הבאים למערכת BusinessMan
                </Title>
                <Paragraph
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: isMobile ? 18 : 22,
                    marginBottom: 60,
                    lineHeight: 1.7,
                    maxWidth: "600px",
                    margin: "0 auto 60px auto",
                  }}
                >
                  הדרך החכמה לנהל את העסק שלך - כלים מתקדמים לניהול הכנסות, הוצאות ודוחות
                </Paragraph>
                <Space size="large" wrap style={{ justifyContent: "center" }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/view-data")}
                    style={{
                      height: 70,
                      padding: "0 50px",
                      background: "rgba(255,255,255,0.2)",
                      borderColor: "rgba(255,255,255,0.4)",
                      color: "white",
                      fontWeight: 600,
                      fontSize: 20,
                      borderRadius: 35,
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    }}
                  >
                    צפה בנתוני העסק
                  </Button>
                  <Button
                    size="large"
                    onClick={() => navigate("/account-transactions")}
                    style={{
                      height: 70,
                      padding: "0 50px",
                      background: orange,
                      borderColor: orange,
                      color: "white",
                      fontWeight: 600,
                      fontSize: 20,
                      borderRadius: 35,
                      boxShadow: "0 8px 32px rgba(250,140,22,0.3)",
                    }}
                  >
                    נהל תנועות בעסק
                  </Button>
                </Space>
              </motion.div>
            </Col>
            <Col xs={24} lg={12} style={{ textAlign: "center" }}>
              <motion.div variants={containerVariants}>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 600,
                    height: 500,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(20px)",
                    border: "2px solid rgba(255,255,255,0.3)",
                    margin: "0 auto",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  }}
                >
                  <BuildOutlined style={{ fontSize: 200, color: "rgba(255,255,255,0.9)" }} />
                </div>
              </motion.div>
            </Col>
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
            padding: "80px 40px",
            background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ width: "100%", maxWidth: "1400px" }}>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <Title
                level={1}
                style={{
                  marginBottom: 24,
                  fontSize: isMobile ? "2.5rem" : "3.5rem",
                  color: "#1a202c",
                  fontWeight: 700,
                }}
              >
                סטטיסטיקות העסק
              </Title>
              <Text
                style={{
                  fontSize: 20,
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
            <Row gutter={[40, 40]} justify="center">
              {statsData.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div variants={containerVariants}>
                    <Card
                      style={{
                        // height: "280px",
                        borderRadius: "32px",
                        border: "none",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
                        background: "white",
                        overflow: "hidden",
                        position: "relative",
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
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          height: "100%",
                          // padding: "40px 24px",
                        }}
                      >
                        <Avatar
                          size={100}
                          style={{
                            background: `${stat.color}15`,
                            color: stat.color,
                            marginBottom: 32,
                            border: `3px solid ${stat.color}30`,
                          }}
                        >
                          <div style={{ fontSize: 40 }}>{stat.icon}</div>
                        </Avatar>
                        <Title
                          level={4}
                          style={{
                            color: "#2d3748",
                            marginBottom: 16,
                            fontSize: 16,
                            fontWeight: 500,
                          }}
                        >
                          {stat.title}
                        </Title>
                        <div
                          style={{
                            color: stat.color,
                            fontSize: "2.8rem",
                            fontWeight: "bold",
                            marginBottom: 16,
                            lineHeight: 1,
                          }}
                        >
                          {stat.prefix}
                          {stat.value}
                          {stat.suffix}
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {stat.trend > 0 ? (
                            <RiseOutlined style={{ color: "#48bb78", marginLeft: 8, fontSize: 20 }} />
                          ) : (
                            <FallOutlined style={{ color: "#f56565", marginLeft: 8, fontSize: 20 }} />
                          )}
                          <Text
                            style={{
                              color: stat.trend > 0 ? "#48bb78" : "#f56565",
                              fontWeight: 600,
                              fontSize: 18,
                            }}
                          >
                            {stat.trend > 0 ? "+" : ""}
                            {stat.trend}%
                          </Text>
                        </div>
                      </div>
                    </Card>
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
            padding: "0 30px",
            background: "white",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ width: "100%", maxWidth: "800px" }}>
            <Title
              level={2}
              style={{
                textAlign: "center",
                marginBottom: 60,
                fontSize: isMobile ? "2rem" : "2.5rem",
                color: "#2d3748",
              }}
            >
              פעולות מהירות
            </Title>
            <Row gutter={[24, 24]}>
              {quickActions.map((action, index) => (
                <Col xs={24} sm={8} key={index}>
                  <motion.div variants={containerVariants}>
                    <Button
                      type="default"
                      size="large"
                      icon={action.icon}
                      onClick={() => navigate(action.path)}
                      block
                      style={{
                        height: "120px",
                        borderRadius: 20,
                        borderWidth: 2,
                        fontWeight: 600,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        gap: 12,
                      }}
                    >
                      <div style={{ fontSize: 32 }}>{action.icon}</div>
                      {action.title}
                    </Button>
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
            padding: "0 30px",
            background: "#f8fafc",
            position: "relative",
            width: "100%",
          }}
        >
          <div style={{ width: "100%", maxWidth: "1200px" , height: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <Title
                level={2}
                style={{
                  marginBottom: 16,
                  fontSize: isMobile ? "2rem" : "2.5rem",
                  color: "#2d3748",
                }}
              >
                ניהול העסק שלך
              </Title>
              <Text
                type="secondary"
                style={{
                  fontSize: 18,
                  display: "block",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                כל הכלים שאתה צריך לניהול יעיל ומוצלח של העסק שלך במקום אחד
              </Text>
            </div>

            <Row gutter={[32, 32]} >
              {menuItems.map((item, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div variants={containerVariants} style={{ height: "100%" }}>
                    <Card
                      className="feature-card"
                      hoverable
                      style={{
                        height: "100%",
                        borderRadius: "24px",
                        border: "none",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                        background: "white",
                      }}
                      bodyStyle={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div
                          className="icon-wrapper"
                          style={{
                            background: `${item.color}20`,
                            color: item.color,
                            width: "80px",
                            height: "80px",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "24px",
                            fontSize: "40px",
                          }}
                        >
                          {item.icon}
                        </div>
                        <Title
                          level={3}
                          style={{
                            marginBottom: 16,
                            color: "#2d3748",
                            fontSize: "1.5rem",
                          }}
                        >
                          {item.title}
                        </Title>
                        <Paragraph
                          type="secondary"
                          style={{
                            marginBottom: 32,
                            fontSize: 16,
                            lineHeight: 1.5,
                          }}
                        >
                          {item.description}
                        </Paragraph>
                      </div>
                      <Button
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate(item.path)}
                        style={{
                          height: 50,
                          background: item.color,
                          borderColor: item.color,
                          fontWeight: 600,
                          fontSize: 16,
                        }}
                        block
                      >
                        כניסה
                      </Button>
                    </Card>
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
            padding: "0 30px",
            background: "white",
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1000px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Card
              className="testimonial-section"
              style={{
                background: "linear-gradient(135deg, #f7f9fc 0%, #eef2f7 100%)",
                border: "none",
                borderRadius: "30px",
                marginBottom: 60,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              }}
              bodyStyle={{
                padding: "60px",
              }}
            >
              <Row gutter={[32, 32]} align="middle">
                <Col xs={24} lg={16}>
                  <Title
                    level={3}
                    style={{
                      color: "#667eea",
                      marginBottom: 24,
                      fontSize: isMobile ? "1.5rem" : "2rem",
                      textAlign: isMobile ? "center" : "right",
                      lineHeight: 1.4,
                    }}
                  >
                    "מערכת BusinessMan שינתה את הדרך שבה אני מנהל את העסק שלי. הכל נגיש ויעיל."
                  </Title>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 16,
                      display: "block",
                      textAlign: isMobile ? "center" : "right",
                    }}
                  >
                    יוסי כהן, בעלים של "טכנולוגיות מתקדמות" בע״מ
                  </Text>
                </Col>
                <Col xs={24} lg={8} style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/register-user")}
                    style={{
                      height: 60,
                      padding: "0 40px",
                      fontWeight: 600,
                      marginBottom: 16,
                      fontSize: 18,
                    }}
                  >
                    הצטרף עכשיו
                  </Button>
                  <div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 14,
                        display: "block",
                      }}
                    >
                      הצטרפו למאות עסקים שכבר משתמשים במערכת
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Footer */}
            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 40 }}>
              <Row justify="space-between" align="middle" gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Space style={{ width: "100%", justifyContent: isMobile ? "center" : "flex-start" }}>
                    <Avatar size={48} style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                      <DashboardOutlined />
                    </Avatar>
                    <div style={{ textAlign: isMobile ? "center" : "right" }}>
                      <Title
                        level={4}
                        style={{
                          margin: 0,
                          color: "#667eea",
                          fontSize: "1.5rem",
                        }}
                      >
                        BusinessMan
                      </Title>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 14,
                        }}
                      >
                        © 2025 BusinessMan. כל הזכויות שמורות.
                      </Text>
                    </div>
                  </Space>
                </Col>
                <Col xs={24} sm={12}>
                  <Space style={{ width: "100%", justifyContent: isMobile ? "center" : "flex-end" }}>
                    <Button onClick={() => {nav("/term-of-service")}} type="text" size="large" style={{ fontSize: 16 }}>
                      תנאי שימוש
                    </Button>
                    <Button onClick={() => {nav("/private-policy")}} type="text" size="large" style={{ fontSize: 16 }}>
                      פרטיות
                    </Button>
                    <Button onClick={() => {nav('/concat-us')}} type="text" size="large" style={{ fontSize: 16 }}>
                      צור קשר
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </ConfigProvider>
  )
}

export default MyHome
