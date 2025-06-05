"use client"

import { useContext, useEffect, useState } from "react"
import { Typography, Row, Col, Card, Button, Space, Avatar, Statistic, ConfigProvider } from "antd"
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
import { globalContext } from "../context/GlobalContext"
import axios from "axios"
import dayjs from "dayjs"
import { UserDto } from "../models/UserDto"

const { Title, Text, Paragraph } = Typography

const MyHome = () => {
  const globalContextDetails = useContext(globalContext)
  const [incomes, setIcomes] = useState<number>(0)
  const [incomesPrecent, setIcomesPrecent] = useState<number>(0)
  const [expenses, setExpenses] = useState<number>(0)
  const [expensesPrecent, setExpensesPrecent] = useState<number>(0)
  const [userPrecent, setUserPrecent] = useState<number>(0)
  const users = globalContextDetails.usersCount || 0
  const [monthlyReport, setMonthlyReport] = useState<number | null>(null)

  const navigate = useNavigate()

  const menuItems = [
    {
      title: "לוח בקרה",
      icon: <DashboardOutlined style={{ fontSize: 32, color: "#667eea" }} />,
      description: "צפה בנתונים עדכניים של העסק שלך",
      path: "/view-data",
      color: "#667eea",
    },
    {
      title: "פרטי העסק",
      icon: <ShopOutlined style={{ fontSize: 32, color: "#52c41a" }} />,
      description: " אין לך עדיין עסק? בוא נקים אותו יחד:)",
      path: "/register-admin&business",
      color: "#52c41a",
    },
    {
      title: "הוספת תנועה בחשבון",
      icon: <DollarOutlined style={{ fontSize: 32, color: "#fa8c16" }} />,
      description: "נהל תנועות שונות בחשבון שלך",
      path: "/account-transactions",
      color: "#fa8c16",
    },
    {
      title: "דוחות",
      icon: <BarChartOutlined style={{ fontSize: 32, color: "#722ed1" }} />,
      description: "צפה בדוחות ביצועים ותחזיות",
      path: "/production-reports",
      color: "#722ed1",
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
      color: "#52c41a",
      icon: <DollarOutlined />,
    },
    {
      title: "משתמשים פעילים",
      value: users,
      trend: userPrecent,
      color: "#1890ff",
      icon: <TeamOutlined />,
    },
    {
      title: "מדד חודשי",
      value: monthlyReport ?? 0,
      suffix: "%",
      trend: incomesPrecent,
      color: "#722ed1",
      icon: <RiseOutlined />,
    },
    {
      title: "הוצאות החודש",
      value: expenses,
      trend: expensesPrecent,
      color: "#fa8c16",
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
      const lastMonth = now.subtract(1, 'month').month()
      const lastMonthYear = now.subtract(1, 'month').year()

      const usersThisMonth = users.filter(user => {
        const created = dayjs(user.createdAt)
        return created.month() === currentMonth && created.year() === currentYear
      })

      const usersLastMonth = users.filter(user => {
        const created = dayjs(user.createdAt)
        return created.month() === lastMonth && created.year() === lastMonthYear
      })

      const countThisMonth = usersThisMonth.length
      const countLastMonth = usersLastMonth.length

      if (countLastMonth === 0) {
        return countThisMonth > 0 ? 100 : 0 // אם בחודש שעבר לא היו משתמשים בכלל
      }

      const percentGrowth = ((countThisMonth - countLastMonth) / countLastMonth) * 100
      return Math.round(percentGrowth)
    } catch (error) {
      console.error('שגיאה בעת שליפת המשתמשים:', error)
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
          `https://localhost:7031/api/Reports/monthly?businessId=${businessId}&year=${year}&month=${month}`
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
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <ConfigProvider direction="rtl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{position:'absolute', padding:'0 30px'}}
      >
        {/* Hero Section */}
        <motion.div
          className="hero-section"
          variants={itemVariants}
          style={{ position: "relative", zIndex: 1, marginTop: 64 }}
        >
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={14}>
              <motion.div variants={itemVariants}>
                <Title level={1} style={{ color: "white", marginBottom: 16, fontSize: "2.5rem" }}>
                  שלום, {globalContextDetails.user?.firstName || "אורח"} {globalContextDetails.user?.lastName || ""}
                </Title>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Title level={3} style={{ color: "rgba(255,255,255,0.9)", marginBottom: 24, fontWeight: 400 }}>
                  ברוכים הבאים למערכת BusinessMan - הדרך החכמה לנהל את העסק שלך
                </Title>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginBottom: 32 }}>
                  נהל את העסק שלך בקלות ויעילות עם כלים מתקדמים לניהול הכנסות, הוצאות, משתמשים ודוחות.
                </Paragraph>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Space size="large" wrap>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/view-data")}
                    style={{
                      height: 48,
                      padding: "0 32px",
                      background: "#fa8c16",
                      borderColor: "#fa8c16",
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    צפה בנתוני העסק
                  </Button>
                  <Button
                    size="large"
                    onClick={() => navigate("/account-transactions")}
                    style={{
                      height: 48,
                      padding: "0 32px",
                      background: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(255,255,255,0.3)",
                      color: "white",
                      fontWeight: 600,
                      fontSize: 16,
                    }}
                  >
                    נהל תנועות בעסק
                  </Button>
                </Space>
              </motion.div>
            </Col>
            <Col xs={0} lg={10} style={{ textAlign: "center" }}>
              <motion.div variants={itemVariants}>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 400,
                    height: 300,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <BuildOutlined style={{ fontSize: 120, color: "rgba(255,255,255,0.8)" }} />
                </div>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

        {/* Stats Section */}
        <motion.div variants={itemVariants}>
          <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
            {statsData.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div variants={itemVariants}>
                  <Card className="stats-card">
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <Avatar
                        size={48}
                        style={{
                          background: `${stat.color}20`,
                          color: stat.color,
                          marginLeft: 12,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                    </div>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      valueStyle={{
                        color: stat.color,
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    />
                    <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
                      {stat.trend > 0 ? (
                        <RiseOutlined style={{ color: "#52c41a", marginLeft: 4 }} />
                      ) : (
                        <FallOutlined style={{ color: "#ff4d4f", marginLeft: 4 }} />
                      )}
                      <Text
                        style={{
                          color: stat.trend > 0 ? "#52c41a" : "#ff4d4f",
                          fontWeight: 600,
                          marginLeft: 8,
                        }}
                      >
                        {stat.trend > 0 ? "+" : ""}
                        {stat.trend}%
                      </Text>
                      <Text type="secondary">מהחודש הקודם</Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} style={{ marginBottom: 48 }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
            פעולות מהירות
          </Title>
          <Row gutter={[16, 16]}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={8} key={index}>
                <motion.div variants={itemVariants}>
                  <Button
                    type="default"
                    size="large"
                    icon={action.icon}
                    onClick={() => navigate(action.path)}
                    block
                    style={{
                      height: 56,
                      borderRadius: 12,
                      borderWidth: 2,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {action.title}
                  </Button>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Main Menu Cards */}
        <motion.div variants={itemVariants} style={{ marginBottom: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={3} style={{ marginBottom: 8 }}>
              ניהול העסק שלך
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              כל הכלים שאתה צריך לניהול יעיל ומוצלח של העסק שלך במקום אחד
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            {menuItems.map((item, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div variants={itemVariants}>
                  <Card className="feature-card" hoverable style={{ height: "100%" }} bodyStyle={{ padding: 32 }}>
                    <div className="icon-wrapper" style={{ background: `${item.color}20`, color: item.color }}>
                      {item.icon}
                    </div>
                    <Title level={4} style={{ marginBottom: 12, color: "#2d3748" }}>
                      {item.title}
                    </Title>
                    <Paragraph type="secondary" style={{ marginBottom: 24, minHeight: 48 }}>
                      {item.description}
                    </Paragraph>
                    <Button
                      type="text"
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate(item.path)}
                      style={{
                        padding: 0,
                        height: "auto",
                        color: item.color,
                        fontWeight: 600,
                      }}
                    >
                      כניסה
                    </Button>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Testimonial */}
        <motion.div variants={itemVariants}>
          <Card className="testimonial-section">
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={16}>
                <Title level={4} style={{ color: "#667eea", marginBottom: 16 }}>
                  "מערכת BusinessMan שינתה את הדרך שבה אני מנהל את העסק שלי. הכל נגיש ויעיל."
                </Title>
                <Text type="secondary">יוסי כהן, בעלים של "טכנולוגיות מתקדמות" בע״מ</Text>
              </Col>
              <Col xs={24} lg={8} style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate("/register-user")}
                  style={{
                    height: 48,
                    padding: "0 32px",
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  הצטרף עכשיו
                </Button>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    הצטרפו למאות עסקים שכבר משתמשים במערכת
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid #f0f0f0" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Avatar style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                  <DashboardOutlined />
                </Avatar>
                <div>
                  <Title level={4} style={{ margin: 0, color: "#667eea" }}>
                    BusinessMan
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    © 2025 BusinessMan. כל הזכויות שמורות.
                  </Text>
                </div>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button type="text" size="small">
                  תנאי שימוש
                </Button>
                <Button type="text" size="small">
                  פרטיות
                </Button>
                <Button type="text" size="small">
                  צור קשר
                </Button>
              </Space>
            </Col>
          </Row>
        </motion.div>
      </motion.div>
    </ConfigProvider>
  );
}

export default MyHome
