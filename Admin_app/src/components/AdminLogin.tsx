"use client"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Alert,
  Space,
  Avatar,
  Divider,
  ConfigProvider,
  Modal
} from "antd"
import {
  MailOutlined,
  LockOutlined,
  CrownOutlined,
  LoginOutlined,
  ExclamationCircleOutlined,
  UserAddOutlined,
  WarningOutlined
} from "@ant-design/icons"

import type { Admin } from "../models/Admin"
import { validationSchemaAdminLogin } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"
import { BusinessDto } from "../models/BusinessDto"
import { useMediaQuery } from "react-responsive"

const { Title, Text, Link } = Typography

const AdminLogin = () => {
  const nav = useNavigate()
  const [admin, setAdmin] = useState<Admin>({ email: "", password: "" })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [show401Modal, setShow401Modal] = useState(false)
  const url = import.meta.env.VITE_API_URL
  const validationSchema = validationSchemaAdminLogin
  const globalContextDetails = useContext(globalContext)
  const isMobile = useMediaQuery({ maxWidth: 768 })

  const handleSubmit = async () => {
    setLoading(true)
    setErrors([])

    try {
      const valid = await validationSchema.isValid(admin)
      if (!valid) {
        const validationErrors = await validationSchema.validate(admin).catch((err) => err.errors)
        setErrors(validationErrors || [])
        return
      }

      let data: any

      try {
        const response = await axios.post(`${url}/Auth/admin-login`, admin, {
          withCredentials: true
        })
        data = response.data
        globalContextDetails.setUser(data.user)
        globalContextDetails.setIsAdmin(true)
      } catch (e: any) {
        // בדיקה מיוחדת לשגיאת 401
        if (e?.response?.status === 401) {
          setShow401Modal(true)
          return
        }

        const message =
          e?.response?.data?.message ||
          e?.message ||
          "שגיאה בכניסה, נא לנסות שוב מאוחר יותר"
        setErrors([message])
        return
      }

      try {
        const res = await axios.get<BusinessDto>(
          `${url}/api/Business/${data.user.businessId}`,
          { withCredentials: true }
        )
        globalContextDetails.setBusinessGlobal(res.data)
        globalContextDetails.setUserCount(res.data.usersCount)
      } catch (e: any) {
        const message =
          e?.response?.data?.message ||
          e?.message ||
          "שגיאה לא צפויה, נסה שוב מאוחר יותר."
        setErrors([message])
        return
      }

      nav("/")
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.message ||
        "שגיאה לא צפויה, נסה שוב מאוחר יותר."
      setErrors([message])
    } finally {
      setLoading(false)
    }
  }

  const handleGoToRegister = () => {
    setShow401Modal(false)
    nav("/register-admin&business")
  }

  const handle401ModalClose = () => {
    setShow401Modal(false)
  }

  return (
    <ConfigProvider direction="rtl">
      <div
        className="centered-layout"
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "16px" : "24px"
        }}
      >
        <Card
          className="login-form"
          style={{
            maxWidth: 500,
            width: "100%"
          }}
          styles={{
            body: {
              padding: isMobile ? "24px" : "40px"
            }
          }}
        >
          <div style={{ textAlign: "center", marginBottom: isMobile ? 24 : 32 }}>
            <Avatar
              size={isMobile ? 64 : 80}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                marginBottom: 16,
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)"
              }}
            >
              <CrownOutlined style={{ fontSize: isMobile ? 28 : 40 }} />
            </Avatar>

            <Title
              level={2}
              style={{
                marginBottom: 8,
                color: "#2d3748",
                textAlign: "center",
                fontSize: isMobile ? "1.5rem" : "2rem"
              }}
            >
              כניסת מנהל
            </Title>
            <Text
              type="secondary"
              style={{
                fontSize: isMobile ? 14 : 16,
                display: "block"
              }}
            >
              ברוכים הבאים למערכת ניהול העסק
            </Text>
          </div>

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="אימייל" required>
              <Input
                prefix={<MailOutlined style={{ color: "#667eea" }} />}
                placeholder="הזן את האימייל שלך"
                size="large"
                value={admin.email}
                onChange={(e) =>
                  setAdmin((prev) => ({ ...prev, email: e.target.value }))
                }
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            <Form.Item label="סיסמא" required>
              <Input.Password
                prefix={<LockOutlined style={{ color: "#667eea" }} />}
                placeholder="הזן את הסיסמה שלך"
                size="large"
                value={admin.password}
                onChange={(e) =>
                  setAdmin((prev) => ({ ...prev, password: e.target.value }))
                }
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<LoginOutlined />}
              block
              style={{
                height: 48,
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 16
              }}
            >
              התחבר
            </Button>

            <Divider>
              <Text type="secondary">או</Text>
            </Divider>

            <div style={{ textAlign: "center" }}>
              <Space>
                <Text type="secondary">אין לך חשבון?</Text>
                <Link href="/register-admin&business" style={{ fontWeight: 600 }}>
                  הירשם כמנהל
                </Link>
              </Space>
            </div>

            {errors.length > 0 && (
              <div style={{ marginTop: 16 }}>
                {errors.map((error, index) => (
                  <Alert
                    key={index}
                    message="שגיאה בהתחברות"
                    description={error}
                    type="error"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    style={{
                      marginBottom: 8,
                      borderRadius: 8,
                      background: "linear-gradient(135deg, #fff2f0 0%, #ffebe8 100%)",
                      border: "1px solid #ffccc7",
                      fontSize: isMobile ? 12 : 14
                    }}
                  />
                ))}
              </div>
            )}
          </Form>
        </Card>

        {/* Modal לשגיאת 401 - מנהל לא רשום */}
        <Modal
          title={
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <Avatar
                size={64}
                style={{
                  background: "linear-gradient(135deg, #faad14 0%, #d46b08 100%)",
                  marginBottom: 16,
                }}
              >
                <WarningOutlined style={{ fontSize: 32 }} />
              </Avatar>
              <Title level={3} style={{ margin: 0, color: "#d46b08" }}>
                מנהל לא רשום במערכת
              </Title>
            </div>
          }
          open={show401Modal}
          onCancel={handle401ModalClose}
          centered
          width={500}
          footer={[
            <Button 
              key="cancel" 
              onClick={handle401ModalClose}
              size="large"
            >
              ביטול
            </Button>,
            <Button
              key="register"
              type="primary"
              onClick={handleGoToRegister}
              size="large"
              icon={<UserAddOutlined />}
              style={{
                background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                border: "none",
                fontWeight: 600,
              }}
            >
              הירשם עכשיו
            </Button>
          ]}
        >
          <div style={{ padding: "24px 16px", textAlign: "center" }}>
            <Alert
              message="גישה נדחתה"
              description={
                <div style={{ textAlign: "right", marginTop: 12 }}>
                  <Text style={{ fontSize: 16, lineHeight: "1.6" }}>
                    כתובת האימייל שהזנת לא רשומה במערכת כמנהל.
                    <br />
                    <br />
                    <strong>כדי להמשיך, עליך:</strong>
                  </Text>
                  <ul style={{ marginTop: 12, textAlign: "right", fontSize: 15 }}>
                    <li>שלח מייל לכתובת brurya.zarbiv@gmail.com,</li>
                    <li>צרף פרטים אישיים,</li>
                    <li> יישלח אליך מייל חוזר עם הודעה שנרשמת למערכת.</li>
                  </ul>
                </div>
              }
              type="warning"
              showIcon
              style={{
                textAlign: "right",
                borderRadius: 12,
                background: "linear-gradient(135deg, #fff7e6 0%, #ffecc7 100%)",
                border: "1px solid #ffd666"
              }}
            />
            
            <div style={{ marginTop: 20, padding: "16px", background: "#f0f9ff", borderRadius: 8, border: "1px solid #91d5ff" }}>
              <Text type="secondary" style={{ fontSize: 14 }}>
                💡 <strong>טיפ:</strong> אם זה הביקור הראשון שלך במערכת, 
                לחץ על "הירשם עכשיו" כדי ליצור חשבון מנהל ועסק חדשים.
              </Text>
            </div>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default AdminLogin