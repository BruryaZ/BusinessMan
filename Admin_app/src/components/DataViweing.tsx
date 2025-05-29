"use client"
import axios from "axios"
import type React from "react"

import { useState, useContext } from "react"
import {
  Button,
  Typography,
  Card,
  Alert,
  Spin,
  ConfigProvider,
  Space,
  Avatar,
  Divider,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Input,
  Form,
  Modal,
  InputNumber,
  message,
} from "antd"
import {
  EyeOutlined,
  ShopOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DollarOutlined,
  WarningOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BankOutlined,
  CreditCardOutlined,
  WalletOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons"
import { Business } from "../models/Business"
import { globalContext } from "../context/GlobalContext"

const { Title, Text } = Typography

function DataViewing() {
  const url = import.meta.env.VITE_API_URL
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const globalContextDetails = useContext(globalContext) as { user: { businessId: number } }
  const [form] = Form.useForm()

  const [business, setBusiness] = useState<Business>({
    id: 0,
    businessId: 0,
    name: "",
    address: "",
    email: "",
    businessType: "",
    income: 0,
    expenses: 0,
    cashFlow: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    netWorth: 0,
    createdAt: new Date(),
    createdBy: "",
    updatedAt: new Date(),
    updatedBy: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setLoading(true)
    
    try {
      const res = await axios.get<Business>(`${url}/api/Business/${globalContextDetails.user.businessId}`, {
        withCredentials: true,
      })

      if (res.status !== 200) {
        setErrors(["שגיאה בטעינת נתוני העסק"])
        setLoading(false)
        return
      }

      if (!res.data) {
        setErrors(["לא נמצאו נתונים"])
        setLoading(false)
        return
      }
      setBusiness(res.data)
      setDataLoaded(true)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching business data:", error)
      setErrors(["שגיאה בטעינת נתוני העסק"])
      setLoading(false)
    }
  }

  const handleEdit = () => {
    form.setFieldsValue(business)
    setEditModalVisible(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const updatedBusiness = { ...business, ...values }

      // Here you would typically make an API call to update the business
      // await axios.put(`${url}/api/Business/${business.id}`, updatedBusiness)

      setBusiness(updatedBusiness)
      setEditModalVisible(false)
      message.success("נתוני העסק עודכנו בהצלחה!")
    } catch (error) {
      message.error("שגיאה בעדכון נתוני העסק")
    }
  }


  const getChangeIcon = (value: number) => {
    return value > 0 ? <RiseOutlined style={{ color: "#52c41a" }} /> : <FallOutlined style={{ color: "#ff4d4f" }} />
  }

  const calculateProfitMargin = () => {
    if (business.income === 0) return 0
    return (((business.income - business.expenses) / business.income) * 100).toFixed(1)
  }

  const calculateROI = () => {
    if (business.totalAssets === 0) return 0
    return ((business.netWorth / business.totalAssets) * 100).toFixed(1)
  }

  const businessMetrics = [
    {
      title: "הכנסות כוללות",
      value: business.income,
      prefix: "₪",
      icon: <DollarOutlined />,
      color: "#52c41a",
      change: 12.5,
      description: "גידול של 12.5% מהחודש הקודם",
    },
    {
      title: "הוצאות כוללות",
      value: business.expenses,
      prefix: "₪",
      icon: <CreditCardOutlined />,
      color: "#ff4d4f",
      change: -3.2,
      description: "ירידה של 3.2% מהחודש הקודם",
    },
    {
      title: "תזרים מזומנים",
      value: business.cashFlow,
      prefix: "₪",
      icon: <WalletOutlined />,
      color: business.cashFlow > 0 ? "#52c41a" : "#ff4d4f",
      change: 8.7,
      description: "שיפור של 8.7% מהחודש הקודם",
    },
    {
      title: "סך נכסים",
      value: business.totalAssets,
      prefix: "₪",
      icon: <BankOutlined />,
      color: "#1890ff",
      change: 5.3,
      description: "גידול של 5.3% מהחודש הקודם",
    },
    {
      title: "התחייבויות",
      value: business.totalLiabilities,
      prefix: "₪",
      icon: <CreditCardOutlined />,
      color: "#fa8c16",
      change: -2.1,
      description: "ירידה של 2.1% מהחודש הקודם",
    },
    {
      title: "שווי נקי",
      value: business.netWorth,
      prefix: "₪",
      icon: <WarningOutlined />,
      color: "#722ed1",
      change: 15.4,
      description: "גידול של 15.4% מהחודש הקודם",
    },
  ]

  const performanceMetrics = [
    {
      title: "שיעור רווח",
      value: calculateProfitMargin(),
      suffix: "%",
      target: 25,
      color: "#52c41a",
    },
    {
      title: "תשואה על השקעה",
      value: calculateROI(),
      suffix: "%",
      target: 15,
      color: "#1890ff",
    },
    {
      title: "יחס חוב להון",
      value: business.totalAssets > 0 ? ((business.totalLiabilities / business.totalAssets) * 100).toFixed(1) : 0,
      suffix: "%",
      target: 40,
      color: "#fa8c16",
    },
  ]

  return (
    <ConfigProvider direction="rtl">
      <div style={{ marginTop: "150vh" }}></div>

      <div className="business-data-container" style={{ maxWidth: 1400, margin: "0 auto" }}>
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
              <ShopOutlined style={{ fontSize: 40 }} />
            </Avatar>

            <Title level={2} style={{ marginBottom: 8, color: "#2d3748" }}>
              לוח בקרה עסקי מתקדם
            </Title>

            <Text type="secondary" style={{ fontSize: 16 }}>
              צפה ונהל את נתוני העסק שלך בצורה חכמה ויעילה
            </Text>

            <Divider />
          </div>

          {!dataLoaded ? (
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Button
                type="primary"
                size="large"
                disabled={loading}
                loading={loading}
                icon={<EyeOutlined />}
                onClick={handleSubmit}
                style={{
                  height: 56,
                  padding: "0 40px",
                  fontWeight: 600,
                  fontSize: 18,
                  borderRadius: 16,
                }}
              >
                {loading ? "טוען נתונים..." : "טען נתוני עסק"}
              </Button>
            </div>
          ) : (
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              {/* Business Header */}
              <Card
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                }}
              >
                <Row align="middle" justify="space-between">
                  <Col>
                    <Space direction="vertical" size="small">
                      <Title level={3} style={{ color: "white", margin: 0 }}>
                        {business.name}
                      </Title>
                      <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
                        {business.businessType} • {business.address}
                      </Text>
                      <Tag color="gold" style={{ marginTop: 8 }}>
                        {business.email}
                      </Tag>
                    </Space>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      ghost
                      icon={<EditOutlined />}
                      onClick={handleEdit}
                      size="large"
                      style={{
                        borderColor: "white",
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      ערוך פרטים
                    </Button>
                  </Col>
                </Row>
              </Card>

              {/* Financial Metrics */}
              <div>
                <Title level={4} style={{ marginBottom: 16 }}>
                  מדדים פיננסיים עיקריים
                </Title>
                <Row gutter={[16, 16]}>
                  {businessMetrics.map((metric, index) => (
                    <Col xs={24} sm={12} lg={8} key={index}>
                      <Card
                        className="business-metric"
                        style={
                          {
                            height: "100%",
                            background: `${metric.color}08`,
                            border: `1px solid ${metric.color}30`,
                            borderRadius: 16,
                            "--metric-index": index,
                          } as React.CSSProperties
                        }
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Text type="secondary" style={{ fontSize: 14 }}>
                              {metric.title}
                            </Text>
                            <Avatar
                              size={40}
                              style={{
                                background: `${metric.color}20`,
                                color: metric.color,
                              }}
                            >
                              {metric.icon}
                            </Avatar>
                          </div>

                          <Statistic
                            value={metric.value}
                            prefix={metric.prefix}
                            valueStyle={{
                              color: metric.color,
                              fontSize: "1.8rem",
                              fontWeight: "bold",
                            }}
                          />

                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {getChangeIcon(metric.change)}
                            <Text
                              style={{
                                color: metric.change > 0 ? "#52c41a" : "#ff4d4f",
                                fontWeight: 600,
                              }}
                            >
                              {metric.change > 0 ? "+" : ""}
                              {metric.change}%
                            </Text>
                          </div>

                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {metric.description}
                          </Text>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Performance Indicators */}
              <div>
                <Title level={4} style={{ marginBottom: 16 }}>
                  מדדי ביצועים
                </Title>
                <Row gutter={[16, 16]}>
                  {performanceMetrics.map((metric, index) => (
                    <Col xs={24} md={8} key={index}>
                      <Card style={{ height: "100%", borderRadius: 16 }}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Text strong style={{ fontSize: 16 }}>
                            {metric.title}
                          </Text>

                          <div style={{ textAlign: "center", margin: "16px 0" }}>
                            <Progress
                              type="circle"
                              percent={Math.min(
                                (Number.parseFloat(metric.value.toString()) /
                                  Number.parseFloat(metric.target.toString())) *
                                100,
                                100,
                              )}
                              format={() => (
                                <div>
                                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: metric.color }}>
                                    {metric.value}
                                    {metric.suffix}
                                  </div>
                                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                                    יעד: {metric.target}
                                    {metric.suffix}
                                  </div>
                                </div>
                              )}
                              strokeColor={metric.color}
                              size={120}
                            />
                          </div>

                          <div style={{ textAlign: "center" }}>
                            <Tag
                              color={
                                Number.parseFloat(metric.value.toString()) >=
                                  Number.parseFloat(metric.target.toString())
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {Number.parseFloat(metric.value.toString()) >= Number.parseFloat(metric.target.toString())
                                ? "עומד ביעד"
                                : "מתחת ליעד"}
                            </Tag>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Quick Actions */}
              <Card title="פעולות מהירות" style={{ borderRadius: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Button
                      type="primary"
                      icon={<BarChartOutlined />}
                      block
                      size="large"
                      style={{ height: 48, borderRadius: 12 }}
                    >
                      דוח מפורט
                    </Button>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Button
                      type="default"
                      icon={<PieChartOutlined />}
                      block
                      size="large"
                      style={{ height: 48, borderRadius: 12, borderWidth: 2 }}
                    >
                      ניתוח מגמות
                    </Button>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Button
                      type="default"
                      icon={<LineChartOutlined />}
                      block
                      size="large"
                      style={{ height: 48, borderRadius: 12, borderWidth: 2 }}
                    >
                      תחזית עתידית
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Space>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
              <div style={{ marginTop: 24 }}>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  טוען נתוני העסק...
                </Text>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div>
              {errors.map((error, index) => (
                <Alert
                  key={index}
                  message="שגיאה"
                  description={error}
                  type="error"
                  showIcon
                  style={{ marginBottom: 8, borderRadius: 12 }}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Edit Modal */}
        <Modal
          title="עריכת נתוני עסק"
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setEditModalVisible(false)} icon={<CloseOutlined />}>
              ביטול
            </Button>,
            <Button key="save" type="primary" onClick={handleSave} icon={<SaveOutlined />}>
              שמור שינויים
            </Button>,
          ]}
          width={800}
          className="edit-mode"
        >
          <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item label="שם העסק" name="name">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="סוג העסק" name="businessType">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="כתובת" name="address">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="הכנסות" name="income">
                  <InputNumber
                    size="large"
                    style={{ width: "100%" }}
                    formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/₪\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="הוצאות" name="expenses">
                  <InputNumber
                    size="large"
                    style={{ width: "100%" }}
                    formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/₪\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="סך נכסים" name="totalAssets">
                  <InputNumber
                    size="large"
                    style={{ width: "100%" }}
                    formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/₪\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="התחייבויות" name="totalLiabilities">
                  <InputNumber
                    size="large"
                    style={{ width: "100%" }}
                    formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value!.replace(/₪\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default DataViewing
