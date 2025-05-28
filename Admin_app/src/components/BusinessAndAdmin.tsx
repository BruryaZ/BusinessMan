"use client"

import { useContext, useEffect, useState } from "react"
import RegisterBusinessData from "./RegisterBusinessData"
import { globalContext } from "../context/GlobalContext"
import axios from "axios"
import type { BusinessResponsePutModel } from "../models/BusinessResponsePutModel"
import AdminRegister from "./AdminRegister"
import type { UserDto } from "../models/UserDto"
import { Button, Typography, Card, Steps, Divider, Alert, ConfigProvider, Space, Avatar, Row, Col } from "antd"
import { ShopOutlined, UserOutlined, CheckCircleOutlined, RocketOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const BusinessAndAdmin = () => {
  const [isBusiness, setIsBusiness] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [businessDone, setBusinessDone] = useState(false)
  const [adminDone, setAdminDone] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const globalContextDetails = useContext(globalContext)
  const url = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (businessDone && adminDone) {
      updateObjects()
      console.log("הטפסים נוספו בהצלחה")
    }
  }, [businessDone, adminDone])

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
      await axios.put<UserDto>(`${url}/api/User/${globalContextDetails.user.id}`, updateAdmin, {
        withCredentials: true,
      })
      await axios.put<BusinessResponsePutModel>(
        `${url}/api/Business/${globalContextDetails.business_global.id}`,
        updateBusiness,
        { withCredentials: true },
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

  const handleAdminSuccess = () => {
    setAdminDone(true)
    setActiveStep((prevStep) => Math.max(prevStep, 1))
  }

  const handleBusinessSuccess = () => {
    setBusinessDone(true)
    setActiveStep((prevStep) => Math.max(prevStep, 2))
  }

  const steps = [
    {
      title: "התחלה",
      icon: <RocketOutlined />,
    },
    {
      title: "פרטי מנהל",
      icon: <UserOutlined />,
    },
    {
      title: "פרטי עסק",
      icon: <ShopOutlined />,
    },
    {
      title: "סיום",
      icon: <CheckCircleOutlined />,
    },
  ]

  return (
    <ConfigProvider direction="rtl">
      <div style={{ padding: "40px 20px", maxWidth: 1000, margin: "0 auto" }}>
        <Card className="form-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Avatar
              size={80}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                marginBottom: 16,
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
              }}
            >
              <RocketOutlined style={{ fontSize: 40 }} />
            </Avatar>

            <Title level={2} style={{ marginBottom: 8, color: "#2d3748", textAlign: "center" }}>
              הגדרת עסק ומנהל
            </Title>

            <Text type="secondary" style={{ fontSize: 16 }}>
              הגדר את העסק שלך ופרטי המנהל בתהליך פשוט ומהיר
            </Text>

            <Divider />
          </div>

          <Steps current={activeStep} items={steps} style={{ marginBottom: 32 }} />

          {success ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <Avatar
                size={100}
                style={{
                  background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                  marginBottom: 24,
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 50 }} />
              </Avatar>
              <Title level={3} style={{ color: "#52c41a", marginBottom: 16 }}>
                הרישום הושלם בהצלחה!
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                פרטי העסק והמנהל נשמרו במערכת בהצלחה
              </Text>
            </div>
          ) : (
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <Space>
                        <UserOutlined style={{ color: "#667eea" }} />
                        <span>רישום פרטי מנהל</span>
                      </Space>
                    }
                    style={{ height: "100%" }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <Text type="secondary">הזן את פרטי המנהל שיהיה אחראי על ניהול העסק במערכת</Text>
                    </div>
                    <Button
                      onClick={() => {
                        setIsAdmin(!isAdmin)
                        if (!isAdmin) setActiveStep(1)
                      }}
                      type={isAdmin ? "default" : "primary"}
                      size="large"
                      icon={<UserOutlined />}
                      block
                      style={{ marginBottom: isAdmin ? 16 : 0 }}
                    >
                      {isAdmin ? "סגור טופס רישום מנהל" : "פתח טופס רישום מנהל"}
                    </Button>
                    {isAdmin && <AdminRegister onSubmitSuccess={handleAdminSuccess} />}
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <Space>
                        <ShopOutlined style={{ color: "#667eea" }} />
                        <span>רישום פרטי עסק</span>
                      </Space>
                    }
                    style={{ height: "100%" }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <Text type="secondary">הזן את פרטי העסק הפיננסיים והבסיסיים</Text>
                    </div>
                    <Button
                      onClick={() => {
                        setIsBusiness(!isBusiness)
                        if (!isBusiness && adminDone) setActiveStep(2)
                      }}
                      type={isBusiness ? "default" : "primary"}
                      size="large"
                      icon={<ShopOutlined />}
                      block
                      disabled={!adminDone}
                      style={{ marginBottom: isBusiness ? 16 : 0 }}
                    >
                      {isBusiness ? "סגור טופס רישום עסק" : "פתח טופס רישום עסק"}
                    </Button>
                    {isBusiness && <RegisterBusinessData onSubmitSuccess={handleBusinessSuccess} />}
                  </Card>
                </Col>
              </Row>

              {error && (
                <Alert message="שגיאה!" description={error} type="error" showIcon style={{ borderRadius: 8 }} />
              )}
            </Space>
          )}
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default BusinessAndAdmin
