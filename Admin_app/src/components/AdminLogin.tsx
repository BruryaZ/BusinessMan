"use client"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Form, Input, Button, Typography, Card, Alert, Space, Avatar, Divider, ConfigProvider } from "antd"
import { MailOutlined, LockOutlined, CrownOutlined, LoginOutlined } from "@ant-design/icons"

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
        console.log("admin: ", admin);

        const response = await axios.post(`${url}/Auth/admin-login`, admin, { withCredentials: true })
        data = response.data
        globalContextDetails.setUser(data.user)
        console.log("User after set-user !!!!!!!!!!!!!!: ", globalContextDetails.user);

        globalContextDetails.setIsAdmin(true)
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 400) {
          setErrors(["משתמש לא נמצא, נא לבדוק את האימייל והסיסמה"])
        } else {
          setErrors([e instanceof Error ? e.message : "שגיאה בכניסה, נא לנסות שוב מאוחר יותר"])
        }
        return
      }

      try {
        const res = await axios.get<BusinessDto>(`${url}/api/Business/${data.user.businessId}`, { withCredentials: true })
        globalContextDetails.setBusinessGlobal(res.data)
        globalContextDetails.setUserCount(res.data.usersCount)
      } catch (e) {
        setErrors([e instanceof Error ? e.message : "שגיאה בטעינת העסק, נא לנסות שוב מאוחר יותר"])
      }

      nav("/")
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "שגיאה לא צפויה, נא לנסות שוב מאוחר יותר"])
    } finally {
      setLoading(false)
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
              <CrownOutlined style={{ fontSize: isMobile ? 28 : 40 }} />
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
              כניסת מנהל
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
            <Form.Item label="אימייל" required>
              <Input
                prefix={<MailOutlined style={{ color: "#667eea" }} />}
                placeholder="הזן את האימייל שלך"
                size="large"
                value={admin.email}
                onChange={(e) => setAdmin((prev) => ({ ...prev, email: e.target.value }))}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            <Form.Item label="סיסמא" required>
              <Input.Password
                prefix={<LockOutlined style={{ color: "#667eea" }} />}
                placeholder="הזן את הסיסמה שלך"
                size="large"
                value={admin.password}
                onChange={(e) => setAdmin((prev) => ({ ...prev, password: e.target.value }))}
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
                marginBottom: 16,
              }}
            >
              התחבר
            </Button>

            <Divider><Text type="secondary">או</Text></Divider>

            <div style={{ textAlign: "center" }}>
              <Space>
                <Text type="secondary">אין לך חשבון?</Text>
                <Link href="/register-admin&business" style={{ fontWeight: 600 }}>
                  הירשם כמנהל
                </Link>
              </Space>
            </div>

            {errors.length > 0 && (
              <div style={{ marginTop: 24 }}>
                {errors.map((error, idx) => (
                  <Alert
                    key={idx}
                    message={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 8, borderRadius: 8 }}
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

export default AdminLogin
