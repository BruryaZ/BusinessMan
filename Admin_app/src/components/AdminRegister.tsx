"use client"

import type React from "react"
import { useContext, useState } from "react"
import * as Yup from "yup"
import axios from "axios"
import type { UserPostModel } from "../models/UserPostModel"
import { validationSchemaUserRegister } from "../utils/validationSchema"
import { globalContext } from "../context/GlobalContext"
import type { UserDto } from "../models/UserDto"
import { converFromUserDto } from "../utils/convertFromUserDto"
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
  CrownOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography

const AdminRegister = ({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) => {
  const validationSchema = validationSchemaUserRegister
  const [myAdmin, setMyAdmin] = useState<UserPostModel>({
    firstName: "יוסי",
    lastName: "כהן",
    email: "a@a",
    password: "",
    phone: "050-1234567",
    role: 1,
    idNumber: "123456789",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const globalContextDetails = useContext(globalContext)
  const url = import.meta.env.VITE_API_URL

  const handleSubmit = (adminRegister: UserPostModel) => async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)

    validationSchema
      .isValid(adminRegister)
      .then(async (valid) => {
        setErrors([])
        if (valid) {
          try {
            const { data } = await axios.post<UserDto>(`${url}/Auth/admin-register`, adminRegister, {
              withCredentials: true,
            })
            globalContextDetails.setUser(converFromUserDto(data))
            if (data.role == 1) {
              globalContextDetails.setIsAdmin(true)
            }
            if (onSubmitSuccess) onSubmitSuccess()
          } catch (e) {
            console.log(e)
            setErrors(["שגיאה ברישום"])
          }
        } else {
          setErrors(["נא למלא את כל השדות הנדרשים"])
        }
      })
      .catch((err) => {
        console.log("Validation error:", err.errors)
        if (err instanceof Yup.ValidationError) {
          setErrors(err.errors)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type } = event.target
    setMyAdmin((prevUser) => ({
      ...prevUser,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  const handleNumberChange = (field: string, value: number | null) => {
    setMyAdmin((prevUser) => ({
      ...prevUser,
      [field]: value || 0,
    }))
  }

  return (
    <ConfigProvider direction="rtl">
      <Card className="form-section" style={{ width: "100%", maxWidth: "none" }}>
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

          <Title level={3} style={{ marginBottom: 8, color: "#2d3748", textAlign: "center" }}>
            רישום מנהל חדש
          </Title>

          <Text type="secondary" style={{ fontSize: 16 }}>
            נא למלא את כל הפרטים הנדרשים לרישום המנהל
          </Text>

          <Divider />
        </div>

        <Form layout="vertical" onFinish={handleSubmit(myAdmin)}>
          <Title level={4} style={{ marginBottom: 24, color: "#667eea" }}>
            פרטים אישיים
          </Title>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item label="שם פרטי" required>
                <Input
                  name="firstName"
                  prefix={<UserOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן שם פרטי"
                  size="large"
                  value={myAdmin.firstName}
                  onChange={handleChange}
                  style={{ height: 48 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="שם משפחה" required>
                <Input
                  name="lastName"
                  prefix={<UserOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן שם משפחה"
                  size="large"
                  value={myAdmin.lastName}
                  onChange={handleChange}
                  style={{ height: 48 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="טלפון" required>
                <Input
                  name="phone"
                  prefix={<PhoneOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן מספר טלפון"
                  size="large"
                  value={myAdmin.phone}
                  onChange={handleChange}
                  style={{ height: 48 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="מספר תעודת זהות" required>
                <Input
                  name="idNumber"
                  prefix={<IdcardOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן מספר תעודת זהות"
                  size="large"
                  value={myAdmin.idNumber}
                  onChange={handleChange}
                  style={{ height: 48 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="אימייל" required>
                <Input
                  name="email"
                  prefix={<MailOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן כתובת אימייל"
                  size="large"
                  type="email"
                  value={myAdmin.email}
                  onChange={handleChange}
                  style={{ height: 48 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="סיסמא" required>
                <Input.Password
                  name="password"
                  prefix={<LockOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן סיסמא"
                  size="large"
                  value={myAdmin.password}
                  onChange={handleChange}
                  style={{ height: 48 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="תפקיד" required>
                <InputNumber
                  prefix={<TeamOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן קוד תפקיד (1 = מנהל)"
                  size="large"
                  style={{ width: "100%", height: 48 }}
                  value={myAdmin.role}
                  onChange={(value) => handleNumberChange("role", value)}
                  min={1}
                  max={3}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
            <Col xs={24}>
              <Button
              onClick={() => handleSubmit(myAdmin)}
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                icon={<UserAddOutlined />}
                block
                style={{
                  height: 56,
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 12,
                  maxWidth: 220,
                }}
              >
                {loading ? "שומר נתונים..." : "שמור פרטי מנהל"}
              </Button>
            </Col>
          </Row>

          {errors.length > 0 && (
            <div style={{ marginTop: 24 }}>
              {errors.map((error, index) => (
                <Alert key={index} message={error} type="error" showIcon style={{ marginBottom: 8, borderRadius: 8 }} />
              ))}
            </div>
          )}
        </Form>
      </Card>
    </ConfigProvider>
  )
}

export default AdminRegister
