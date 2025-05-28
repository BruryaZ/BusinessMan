"use client"

import { useContext } from "react"
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
import { useNavigate } from "react-router-dom"
import { globalContext } from "../context/GlobalContext"

const { Title, Text, Paragraph } = Typography

const MyHome = () => {
  const globalContextDetails = useContext(globalContext)

  if (!globalContextDetails) {
    throw new Error("globalContext must be used within a GlobalContextProvider")
  }
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
      description: "נהל את פרטי העסק שלך",
      path: "/business-register",
      color: "#52c41a",
    },
    {
      title: "הכנסות והוצאות",
      icon: <DollarOutlined style={{ fontSize: 32, color: "#fa8c16" }} />,
      description: "נהל את התקציב והתזרים של העסק",
      path: "/incom&Expennses",
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
      value: 10500,
      prefix: "₪",
      trend: 12.5,
      color: "#52c41a",
      icon: <DollarOutlined />,
    },
    {
      title: "משתמשים פעילים",
      value: 24,
      trend: 3,
      color: "#1890ff",
      icon: <TeamOutlined />,
    },
    {
      title: "יעילות תפעולית",
      value: 92,
      suffix: "%",
      trend: 5.2,
      color: "#722ed1",
      icon: <RiseOutlined />,
    },
    {
      title: "פרויקטים פעילים",
      value: 18,
      trend: 2,
      color: "#fa8c16",
      icon: <BarChartOutlined />,
    },
  ]

  return (
    <ConfigProvider direction="rtl">
      <div>
        {/* Hero Section */}
        <div className="hero-section" style={{ position: "relative", zIndex: 1, marginTop: "1300px" }}>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={14}>
              <Title level={1} style={{ color: "white", marginBottom: 16, fontSize: "2.5rem" }}>
                שלום, {globalContextDetails.user?.firstName || "אורח"} {globalContextDetails.user?.lastName || ""}
              </Title>
              <Title level={3} style={{ color: "rgba(255,255,255,0.9)", marginBottom: 24, fontWeight: 400 }}>
                ברוכים הבאים למערכת BusinessMan - הדרך החכמה לנהל את העסק שלך
              </Title>
              <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginBottom: 32 }}>
                נהל את העסק שלך בקלות ויעילות עם כלים מתקדמים לניהול הכנסות, הוצאות, משתמשים ודוחות.
              </Paragraph>
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
                  onClick={() => navigate("/business-register")}
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
                  עדכן פרטי עסק
                </Button>
              </Space>
            </Col>
            <Col xs={0} lg={10} style={{ textAlign: "center" }}>
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
            </Col>
          </Row>
        </div>

        {/* Stats Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          {statsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
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
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <div style={{ marginBottom: 48 }}>
          <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
            פעולות מהירות
          </Title>
          <Row gutter={[16, 16]}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={8} key={index}>
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
              </Col>
            ))}
          </Row>
        </div>

        {/* Main Menu Cards */}
        <div style={{ marginBottom: 48 }}>
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
              </Col>
            ))}
          </Row>
        </div>

        {/* Testimonial */}
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

        {/* Footer */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid #f0f0f0" }}>
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
        </div>
      </div>
    </ConfigProvider>
  )
}

export default MyHome
