"use client"
import { useContext, useState } from "react"
import axios from "axios"
import type { AdminRegister } from "../models/AdminRegister"
import { useNavigate } from "react-router-dom"
import { validationSchemaUserLogin } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"
import { Form, Input, Button, Typography, Card, Alert, Space, Avatar, Divider, ConfigProvider } from "antd"
import { MailOutlined, LockOutlined, UserOutlined, LoginOutlined, ExclamationCircleOutlined } from "@ant-design/icons"

const { Title, Text, Link } = Typography

const UserLogin = () => {
  const nav = useNavigate()
  const validationSchema = validationSchemaUserLogin
  const [userLogin, setUserLogin] = useState<AdminRegister>({ email: "", password: "" })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const url = import.meta.env.VITE_API_URL
  const globalContextDetails = useContext(globalContext)

  const handleSubmit = async () => {
    setLoading(true)
    setShowModal(true) // Show modal overlay

    try {
      // Validate form
      await validationSchema.validate(userLogin, { abortEarly: false })
      setErrors([])

      const { data } = await axios.post<any>(`${url}/Auth/user-login`, userLogin, { withCredentials: true })
      globalContextDetails.setUserCount(data.user.businessUsersCount)
      globalContextDetails.setUser(data.user)

      // Success - navigate after short delay
      setTimeout(() => {
        setShowModal(false)
        nav("/")
      }, 1000)
    } catch (err: any) {
      setShowModal(false)

      if (err.name === "ValidationError") {
        setErrors(err.errors || ["נא למלא את כל השדות הנדרשים בצורה תקינה"])
      } else if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message || err.response?.data || "שגיאה בהתחברות. אנא בדוק את פרטי ההתחברות."
        setErrors([errorMessage])
      } else {
        setErrors(["שגיאה לא צפויה. אנא נסה שוב מאוחר יותר."])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setUserLogin((prev) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateField = (field: string, value: string) => {
    const fieldErrors: string[] = []

    if (field === "email") {
      if (!value) {
        fieldErrors.push("שדה האימייל הוא חובה")
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        fieldErrors.push("כתובת האימייל אינה תקינה")
      }
    }

    if (field === "password") {
      if (!value) {
        fieldErrors.push("שדה הסיסמה הוא חובה")
      } else if (value.length < 1) {
        fieldErrors.push("הסיסמה חייבת להכיל לפחות תו אחד")
      }
    }

    return fieldErrors
  }

  return (
    <ConfigProvider direction="rtl">
      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Card className="login-form" style={{ maxWidth: 500, width: "100%" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <Avatar
                  size={80}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    marginBottom: 16,
                    boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <UserOutlined style={{ fontSize: 40 }} />
                </Avatar>

                <Title level={2} style={{ marginBottom: 8, color: "#2d3748", textAlign: "center" }}>
                  מתחבר למערכת...
                </Title>

                <Text type="secondary" style={{ fontSize: 16 }}>
                  אנא המתן בזמן שאנו מאמתים את פרטיך
                </Text>
              </div>

              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div className="ant-spin ant-spin-spinning">
                  <span className="ant-spin-dot ant-spin-dot-spin">
                    <i className="ant-spin-dot-item"></i>
                    <i className="ant-spin-dot-item"></i>
                    <i className="ant-spin-dot-item"></i>
                    <i className="ant-spin-dot-item"></i>
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      <div style={{ marginTop: "50vh" }}></div>
      <div className="centered-layout">
        <Card className="login-form" style={{ maxWidth: 500, width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Avatar
              size={80}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                marginBottom: 16,
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
              }}
            >
              <UserOutlined style={{ fontSize: 40 }} />
            </Avatar>

            <Title level={2} style={{ marginBottom: 8, color: "#2d3748", textAlign: "center" }}>
              כניסת משתמש
            </Title>

            <Text type="secondary" style={{ fontSize: 16 }}>
              ברוכים הבאים למערכת ניהול העסק
            </Text>
          </div>

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="אימייל"
              required
              style={{ marginBottom: 20 }}
              validateStatus={validateField("email", userLogin.email).length > 0 ? "error" : ""}
              help={
                validateField("email", userLogin.email).length > 0 && (
                  <div className="error-message">
                    <ExclamationCircleOutlined />
                    {validateField("email", userLogin.email)[0]}
                  </div>
                )
              }
            >
              <Input
                prefix={<MailOutlined style={{ color: "#667eea" }} />}
                placeholder="הזן את האימייל שלך"
                size="large"
                value={userLogin.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            <Form.Item
              label="סיסמא"
              required
              style={{ marginBottom: 24 }}
              validateStatus={validateField("password", userLogin.password).length > 0 ? "error" : ""}
              help={
                validateField("password", userLogin.password).length > 0 && (
                  <div className="error-message">
                    <ExclamationCircleOutlined />
                    {validateField("password", userLogin.password)[0]}
                  </div>
                )
              }
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#667eea" }} />}
                placeholder="הזן את הסיסמה שלך"
                size="large"
                value={userLogin.password}
                onChange={(e) => handleChange("password", e.target.value)}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              disabled={loading}
              icon={<LoginOutlined />}
              block
              style={{
                height: 48,
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 16,
              }}
            >
              {loading ? "מתחבר..." : "התחבר"}
            </Button>

            <Divider>
              <Text type="secondary">או</Text>
            </Divider>

            <Button
              type="default"
              size="large"
              block
              onClick={() => nav("/register-user")}
              style={{
                height: 48,
                borderRadius: 10,
                fontWeight: 600,
                marginBottom: 16,
                borderWidth: 2,
              }}
            >
              הירשם עכשיו
            </Button>

            <div style={{ textAlign: "center" }}>
              <Space>
                <Text type="secondary">מנהל?</Text>
                <Link href="/admin-login" style={{ fontWeight: 600 }}>
                  התחבר כמנהל
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
                    }}
                  />
                ))}
              </div>
            )}
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default UserLogin
