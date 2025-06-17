"use client"
import { useContext, useState } from "react"
import axios from "axios"
import type { AdminRegister } from "../models/AdminRegister"
import { useNavigate } from "react-router-dom"
import { validationSchemaUserLogin } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"
import { Form, Input, Button, Typography, Card, Alert, Space, Avatar, Divider, ConfigProvider } from "antd"
import { MailOutlined, LockOutlined, UserOutlined, LoginOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { useMediaQuery } from "react-responsive"

const { Title, Text, Link } = Typography

const UserLogin = () => {
  const nav = useNavigate()
  const validationSchema = validationSchemaUserLogin
  const [userLogin, setUserLogin] = useState<AdminRegister>({ email: "", password: "" })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const url = import.meta.env.VITE_API_URL
  const globalContextDetails = useContext(globalContext)

  const isMobile = useMediaQuery({ maxWidth: 768 })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const valid = await validationSchema.isValid(userLogin)
      setErrors([])

      if (valid) {
        try {
          const { data } = await axios.post<any>(`${url}/Auth/user-login`, userLogin, { withCredentials: true })
          globalContextDetails.setUserCount(data.user.businessUsersCount)
          globalContextDetails.setUser(data.user)
          nav("/")
        }
        catch (e) {
          if (axios.isAxiosError(e) && e.response?.status === 400) {
            setErrors(["משתמש לא נמצא, נא לבדוק את האימייל והסיסמה"])
            return
          }
          setErrors(e instanceof Error ? [e.message] : ["שגיאה בכניסה, נא לנסות שוב מאוחר יותר"])
          return
        }
      }
      else {
        const validationErrors = await validationSchema.validate(userLogin).catch((err) => err.errors)
        setErrors(validationErrors || [])
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 400) {
        setErrors(["משתמש לא נמצא, נא לבדוק את האימייל והסיסמה"])
        return
      }
      setErrors(e instanceof Error ? [e.message] : ["שגיאה בכניסה, נא לנסות שוב מאוחר יותר"])
      return
    }
    finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setUserLogin((prev) => ({ ...prev, [field]: value }))
    if (errors.length > 0) {
      setErrors([])
    }
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
          padding: isMobile ? "16px" : "24px",
          // background: "linear-gradient(135deg, #f7f9fc 0%, #eef2f7 100%)",
        }}
      >
        <Card
          className="login-form"
          style={{
            maxWidth: 500,
            width: "100%",
          }}
          bodyStyle={{
            padding: isMobile ? "24px" : "40px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: isMobile ? 24 : 32 }}>
            <Avatar
              size={isMobile ? 64 : 80}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                marginBottom: 16,
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
              }}
            >
              <UserOutlined style={{ fontSize: isMobile ? 28 : 40 }} />
            </Avatar>

            <Title
              level={2}
              style={{
                marginBottom: 8,
                color: "#2d3748",
                textAlign: "center",
                fontSize: isMobile ? "1.5rem" : "2rem",
              }}
            >
              כניסת משתמש
            </Title>

            <Text
              type="secondary"
              style={{
                fontSize: isMobile ? 14 : 16,
                display: "block",
              }}
            >
              ברוכים הבאים למערכת ניהול העסק
            </Text>
          </div>

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="אימייל"
              required
              style={{ marginBottom: isMobile ? 16 : 20 }}
            >
              <Input
                prefix={<MailOutlined style={{ color: "#667eea" }} />}
                placeholder="הזן את האימייל שלך"
                size={isMobile ? "middle" : "large"}
                value={userLogin.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={{
                  borderRadius: 10,
                  height: isMobile ? "40px" : "48px",
                }}
              />
            </Form.Item>

            <Form.Item
              label="סיסמא"
              required
              style={{ marginBottom: isMobile ? 20 : 24 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#667eea" }} />}
                placeholder="הזן את הסיסמה שלך"
                size={isMobile ? "middle" : "large"}
                value={userLogin.password}
                onChange={(e) => handleChange("password", e.target.value)}
                style={{
                  borderRadius: 10,
                  height: isMobile ? "40px" : "48px",
                }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size={isMobile ? "middle" : "large"}
              loading={loading}
              disabled={loading}
              icon={<LoginOutlined />}
              block
              style={{
                height: isMobile ? 44 : 48,
                borderRadius: 10,
                fontWeight: 600,
                fontSize: isMobile ? 14 : 16,
                marginBottom: 16,
              }}
            >
              {loading ? "מתחבר..." : "התחבר"}
            </Button>

            <Divider>
              <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>או</Text>
            </Divider>

            <Button
              type="default"
              size={isMobile ? "middle" : "large"}
              block
              onClick={() => nav("/register-user")}
              style={{
                height: isMobile ? 44 : 48,
                borderRadius: 10,
                fontWeight: 600,
                marginBottom: 16,
                borderWidth: 2,
                fontSize: isMobile ? 14 : 16,
              }}
            >
              הירשם עכשיו
            </Button>

            <div style={{ textAlign: "center" }}>
              <Space>
                <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>מנהל?</Text>
                <Link
                  href="/admin-login"
                  style={{
                    fontWeight: 600,
                    fontSize: isMobile ? 12 : 14,
                  }}
                >
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
                      fontSize: isMobile ? 12 : 14,
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