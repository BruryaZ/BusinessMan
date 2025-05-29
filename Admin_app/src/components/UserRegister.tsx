"use client"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { validationSchemaUserRegister } from "../utils/validationSchema"
import type { UserPostModel } from "../models/UserPostModel"
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Alert,
  Row,
  Col,
  Avatar,
  Divider,
  ConfigProvider,
  InputNumber,
} from "antd"
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  LockOutlined,
  TeamOutlined,
  UserAddOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons"

const { Title, Text, Link } = Typography

const UserRegister = ({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) => {
  const nav = useNavigate()
  const validationSchema = validationSchemaUserRegister
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  // const { setUser } = useContext(globalContext)
  const url = import.meta.env.VITE_API_URL
  const [myUser, setMyUser] = useState<UserPostModel>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: 0,
    idNumber: "",
  })

  const handleChange = (field: string, value: any) => {
    setMyUser((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const valid = await validationSchema.isValid(myUser)
      setErrors([])

      if (valid) {
        await axios.post<UserPostModel>(`${url}/Auth/user-register`, myUser, { withCredentials: true })
        // setUser(convertToUser(data))

        if (onSubmitSuccess) onSubmitSuccess()
        nav(-1) // Go back to the previous page
      } else {
        setErrors(["נא למלא את כל השדות הנדרשים"])
      }
    } catch (e) {
      console.log(e)
      setErrors(["שגיאה ברישום המשתמש"])
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfigProvider direction="rtl">
      <div style={{ padding: "40px 20px", maxWidth: 800, margin: "0 auto" , marginTop: "70vh"}}>
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
              <UserAddOutlined style={{ fontSize: 40 }} />
            </Avatar>

            <Title level={2} style={{ marginBottom: 8, color: "#2d3748", textAlign:"center" }}>
              הרשמת משתמש חדש
            </Title>

            <Text type="secondary" style={{ fontSize: 16 }}>
              נא למלא את כל הפרטים הנדרשים
            </Text>

            <Divider />
          </div>

          <Form layout="vertical" onFinish={handleSubmit}>
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item label="שם פרטי" required>
                  <Input
                    prefix={<UserOutlined style={{ color: "#667eea" }} />}
                    placeholder="הזן שם פרטי"
                    size="large"
                    value={myUser.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="שם משפחה" required>
                  <Input
                    prefix={<UserOutlined style={{ color: "#667eea" }} />}
                    placeholder="הזן שם משפחה"
                    size="large"
                    value={myUser.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="טלפון" required>
                  <Input
                    prefix={<PhoneOutlined style={{ color: "#667eea" }} />}
                    placeholder="הזן מספר טלפון"
                    size="large"
                    value={myUser.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="מספר תעודת זהות" required>
                  <Input
                    prefix={<IdcardOutlined style={{ color: "#667eea" }} />}
                    placeholder="הזן מספר תעודת זהות"
                    size="large"
                    value={myUser.idNumber}
                    onChange={(e) => handleChange("idNumber", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="אימייל" required>
                  <Input
                    prefix={<MailOutlined style={{ color: "#667eea" }} />}
                    placeholder="הזן כתובת אימייל"
                    size="large"
                    type="email"
                    value={myUser.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="סיסמא" required>
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "#667eea" }} />}
                    placeholder="הזן סיסמא"
                    size="large"
                    value={myUser.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="תפקיד" required>
                  <InputNumber
                    prefix={<TeamOutlined style={{ color: "#667eea" }} />}
                    placeholder="הזן קוד תפקיד"
                    size="large"
                    style={{ width: "100%" }}
                    value={myUser.role}
                    onChange={(value) => handleChange("role", value || 0)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col xs={24} sm={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<UserAddOutlined />}
                  block
                  style={{
                    height: 48,
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  הירשם
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button
                  type="default"
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => nav("/user-login")}
                  block
                  style={{
                    height: 48,
                    fontWeight: 600,
                    borderWidth: 2,
                  }}
                >
                  חזרה לכניסה
                </Button>
              </Col>
            </Row>

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Text type="secondary">
                כבר יש לך חשבון?{" "}
                <Link href="/user-login" style={{ fontWeight: 600 }}>
                  התחבר כאן
                </Link>
              </Text>
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
      </div>
    </ConfigProvider>
  )
}

export default UserRegister
