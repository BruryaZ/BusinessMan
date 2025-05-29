"use client"
import axios from "axios"
import { useState, useContext } from "react"
import { globalContext } from "../context/GlobalContext"
import type { BusinessPostModel } from "../models/BusinessPostModel"
import { convertToBusiness } from "../utils/convertToBusiness"
import { validationSchemaBusinessRegister } from "../utils/validationSchema"
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
  ShopOutlined,
  MailOutlined,
  EnvironmentOutlined,
  TagOutlined,
  DollarOutlined,
  MinusCircleOutlined,
  BankOutlined,
  SaveOutlined,
  CreditCardOutlined,
} from "@ant-design/icons"
import { Business } from "../models/Business"

const { Title, Text } = Typography

const RegisterBusinessData = ({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) => {
  const url = import.meta.env.VITE_API_URL
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const validationSchema = validationSchemaBusinessRegister
  const globalContextDetails = useContext(globalContext)

  const [businessData, setBusinessData] = useState<BusinessPostModel>({
    id: 0,
    businessId: 1,
    name: "עסק לדוגמה",
    address: "כתובת לדוגמה",
    email: "example@business.com",
    businessType: "סוג עסק לדוגמה",
    income: 10000,
    expenses: 5000,
    cashFlow: 5000,
    totalAssets: 20000,
    totalLiabilities: 10000,
  })

  const handleChange = (field: string, value: any) => {
    setBusinessData((prevData) => ({
      ...prevData,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setErrors([])
    try {
      await validationSchema.validate(businessData, { abortEarly: false })
      console.log("Submitting business data:", businessData);

      const { data } = await axios.post<Business>(`${url}/api/Business`, businessData, {
        withCredentials: true,
      })
      globalContextDetails.setBusinessGlobal(convertToBusiness(data))
      if (onSubmitSuccess) onSubmitSuccess()
    } catch (err: any) {
      if (err.name === "ValidationError") {
        if (axios.isAxiosError(err)) {
          console.log("Axios error response:", err.response?.data)
          setErrors([
            err.response?.data?.message || "שגיאה כללית מהשרת"
          ])
        } else {
          console.error("Unknown error:", err)
          setErrors(["שגיאה לא צפויה, נא לנסות שוב מאוחר יותר"])
        }
      } else {
        console.error(err)
        setErrors(["שגיאה לא צפויה, נא לנסות שוב מאוחר יותר"])
      }
    } finally {
      setLoading(false)
    }
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
            <ShopOutlined style={{ fontSize: 40 }} />
          </Avatar>
          <Title level={3} style={{ marginBottom: 8, color: "#2d3748", textAlign: "center" }}>
            רישום פרטי העסק
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            נא למלא את כל הפרטים הנדרשים לרישום העסק שלך
          </Text>
          <Divider />
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Title level={4} style={{ marginBottom: 24, color: "#667eea" }}>
            פרטים בסיסיים
          </Title>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item label="מזהה ייחודי לעסק" required>
                <InputNumber
                  prefix={<ShopOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן מזהה עסק"
                  size="large"
                  style={{ width: "100%", height: 48 }}
                  value={businessData.businessId}
                  onChange={(value) => handleChange("businessId", value ?? 1)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="שם העסק" required>
                <Input
                  prefix={<ShopOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן שם העסק"
                  size="large"
                  value={businessData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  style={{ height: 48 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="כתובת העסק" required>
                <Input
                  prefix={<EnvironmentOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן כתובת העסק"
                  size="large"
                  value={businessData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  style={{ height: 48 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="אימייל של העסק" required>
                <Input
                  prefix={<MailOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן אימייל העסק"
                  size="large"
                  type="email"
                  value={businessData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  style={{ height: 48 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="סוג העסק" required>
                <Input
                  prefix={<TagOutlined style={{ color: "#667eea" }} />}
                  placeholder="הזן סוג העסק (לדוגמה: טכנולוגיה, מסחר, שירותים)"
                  size="large"
                  value={businessData.businessType}
                  onChange={(e) => handleChange("businessType", e.target.value)}
                  style={{ height: 48 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={4} style={{ marginBottom: 24, color: "#667eea" }}>
            נתונים פיננסיים
          </Title>

          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <Form.Item label="הכנסות העסק (₪)" required>
                <InputNumber
                  prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
                  placeholder="הזן הכנסות העסק"
                  size="large"
                  style={{ width: "100%", height: 48 }}
                  value={businessData.income}
                  onChange={(value) => handleChange("income", value ?? 0)}
                  formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => Number(value!.replace(/₪\s?|(,*)/g, ""))}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="הוצאות העסק (₪)" required>
                <InputNumber
                  prefix={<MinusCircleOutlined style={{ color: "#ff4d4f" }} />}
                  placeholder="הזן הוצאות העסק"
                  size="large"
                  style={{ width: "100%", height: 48 }}
                  value={businessData.expenses}
                  onChange={(value) => handleChange("expenses", value ?? 0)}
                  formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => Number(value!.replace(/₪\s?|(,*)/g, ""))}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="תזרים מזומנים (₪)" required>
                <InputNumber
                  prefix={<BankOutlined style={{ color: "#1890ff" }} />}
                  placeholder="הזן תזרים מזומנים"
                  size="large"
                  style={{ width: "100%", height: 48 }}
                  value={businessData.cashFlow}
                  onChange={(value) => handleChange("cashFlow", value ?? 0)}
                  formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => Number(value!.replace(/₪\s?|(,*)/g, ""))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="סך הנכסים (₪)" required>
                <InputNumber
                  prefix={<BankOutlined style={{ color: "#722ed1" }} />}
                  placeholder="הזן סך הנכסים"
                  size="large"
                  style={{ width: "100%", height: 48 }}
                  value={businessData.totalAssets}
                  onChange={(value) => handleChange("totalAssets", value ?? 0)}
                  formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => Number(value!.replace(/₪\s?|(,*)/g, ""))}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="סך ההתחייבויות (₪)" required>
                <InputNumber
                  prefix={<CreditCardOutlined style={{ color: "#fa8c16" }} />}
                  placeholder="הזן סך ההתחייבויות"
                  size="large"
                  style={{ width: "100%", height: 48 }}
                  value={businessData.totalLiabilities}
                  onChange={(value) => handleChange("totalLiabilities", value ?? 0)}
                  formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => Number(value!.replace(/₪\s?|(,*)/g, ""))}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
            <Col xs={24}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                icon={<SaveOutlined />}
                block
                style={{
                  height: 56,
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 12,
                  maxWidth: 220,
                }}
              >
                {loading ? "שומר נתונים..." : "שמור פרטי עסק"}
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

export default RegisterBusinessData
