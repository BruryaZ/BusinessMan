"use client"
import { useContext, useState } from "react"
import type { Admin } from "../models/Admin"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { validationSchemaAdminLogin } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"
import { Form, Input, Button, Typography, Card, Alert, Space, Avatar, Divider, ConfigProvider } from "antd"
import { MailOutlined, LockOutlined, CrownOutlined, LoginOutlined } from "@ant-design/icons"
import CenteredLayout from "./CenteredLayout"

const { Title, Text, Link } = Typography

const AdminLogin = () => {
  const nav = useNavigate()
  const [admin, setAdmin] = useState<Admin>({ email: "", password: "" })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const url = import.meta.env.VITE_API_URL
  const validationSchema = validationSchemaAdminLogin
  const globalContextDetails = useContext(globalContext)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const valid = await validationSchema.isValid(admin)
      setErrors([])

      if (valid) {
        const { data } = await axios.post<any>(`${url}/Auth/admin-login`, admin, { withCredentials: true })
        globalContextDetails.setUser(data.user)
        globalContextDetails.setIsAdmin(true)

        try {
          const res = await axios.get<any>(`${url}/api/Business/${data.user.businessId}`, { withCredentials: true })
          globalContextDetails.setBusinessGlobal(res.data)
        }
        catch (e) {
          setErrors(e instanceof Error ? [e.message] : ["שגיאה בטעינת העסק, נא לנסות שוב מאוחר יותר"])
        }
        nav("/")
      } else {
        setErrors(["נא למלא את כל השדות הנדרשים"])
      }
    } catch (e) {
      setErrors(e instanceof Error ? [e.message] : ["שגיאה לא צפויה, נא לנסות שוב מאוחר יותר"])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setAdmin((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <ConfigProvider direction="rtl" >
      <div style={{ marginTop: "35vh" }}></div>
      <CenteredLayout>
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
              <CrownOutlined style={{ fontSize: 40 }} />
            </Avatar>

            <Title level={2} style={{ marginBottom: 8, color: "#2d3748", textAlign: "center" }}>
              כניסת מנהל
            </Title>

            <Text type="secondary" style={{ fontSize: 16 }}>
              ברוכים הבאים למערכת הניהול
            </Text>
          </div>

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="אימייל" required style={{ marginBottom: 20 }}>
              <Input
                prefix={<MailOutlined style={{ color: "#667eea" }} />}
                placeholder="הזן את האימייל שלך"
                size="large"
                value={admin.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            <Form.Item label="סיסמא" required style={{ marginBottom: 24 }}>
              <Input.Password
                prefix={<LockOutlined style={{ color: "#667eea" }} />}
                placeholder="הזן את הסיסמה שלך"
                size="large"
                value={admin.password}
                onChange={(e) => handleChange("password", e.target.value)}
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
      </CenteredLayout>
    </ConfigProvider>
  )
}

export default AdminLogin
