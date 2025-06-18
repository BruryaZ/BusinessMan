"use client"
import axios from "axios"
import type React from "react"

import { useState, useContext, useEffect } from "react"
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
  CreditCardOutlined,
  WalletOutlined,
  RiseOutlined,
  FallOutlined,
  FileTextOutlined,
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
  const [businessReport, setBusinessReport] = useState<{ totalIncome: number; totalExpenses: number; cashFlow: number; netProfit: number; invoiceCount: number } | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<{ incomeChangePercent: number; expensesChangePercent: number; netProfitChangePercent: number } | null>(null);
  const [error, setError] = useState<string[] | null>(null);

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
    users: [],
    invoices: [],
    usersCount: 0,
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        // קריאה לדוח העסק
        const businessReportResponse = await axios.get<{ totalIncome: number; totalExpenses: number; cashFlow: number; netProfit: number; invoiceCount: number }>(
          `${url}/api/Reports/business-report/${globalContextDetails.user.businessId}`,
          { withCredentials: true }
        );

        const monthlyReportResponse = await axios.get<{ incomeChangePercent: number; expensesChangePercent: number; netProfitChangePercent: number }>(
          `${url}/api/Reports/monthly`,
          {
            params: {
              businessId: globalContextDetails.user.businessId,
              year: new Date().getFullYear(),
              month: new Date().getMonth() + 1, 
            },
          }
        );

        setBusinessReport(businessReportResponse.data as { totalIncome: number; totalExpenses: number; cashFlow: number; netProfit: number; invoiceCount: number });
        setMonthlyReport(monthlyReportResponse.data);
      } catch (err) {
        console.error(err);
        setError(["שגיאה בטעינת הדוחות"]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [business]);

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
      value: businessReport ? businessReport.totalIncome : 0,
      prefix: "₪",
      icon: <DollarOutlined />,
      color: "#52c41a",
      change: monthlyReport ? monthlyReport.incomeChangePercent : 0,
      description: `שינוי של ${monthlyReport ? monthlyReport.incomeChangePercent : 0}% מהחודש הקודם`,
    },
    {
      title: "הוצאות כוללות",
      value: businessReport ? businessReport.totalExpenses : 0,
      prefix: "₪",
      icon: <CreditCardOutlined />,
      color: "#ff4d4f",
      change: monthlyReport ? monthlyReport.expensesChangePercent : 0,
      description: `שינוי של ${monthlyReport ? monthlyReport.expensesChangePercent : 0}% מהחודש הקודם`,
    },
    {
      title: "תזרים מזומנים",
      value: businessReport ? businessReport.cashFlow : 0,
      prefix: "₪",
      icon: <WalletOutlined />,
      color: businessReport ? businessReport.cashFlow : 0 > 0 ? "#52c41a" : "#ff4d4f",
      change: null, // אין שינוי בדוח שלך, אפשר להוריד או להוסיף חישוב אם תרצה
      description: "תזרים מזומנים נוכחי",
    },
    {
      title: "רווח נקי",
      value: businessReport ? businessReport.netProfit : 0,
      prefix: "₪",
      icon: <WarningOutlined />,
      color: "#722ed1",
      change: monthlyReport ? monthlyReport.netProfitChangePercent : 0,
      description: `שינוי של ${monthlyReport ? monthlyReport.netProfitChangePercent : 0}% מהחודש הקודם`,
    },
    {
      title: "מספר חשבוניות",
      value: businessReport ? businessReport.invoiceCount : 0,
      prefix: "",
      icon: <FileTextOutlined />,
      color: "#1890ff",
      change: null,
      description: "מספר החשבוניות בחודש",
    },
  ];

  const performanceMetrics = [
    {
      title: "שיעור רווח",
      value: calculateProfitMargin(),
      color: "#52c41a",
    },
    {
      title: "תשואה על השקעה",
      value: calculateROI(),
      color: "#1890ff",
    },
    {
      title: "יחס חוב להון",
      value: business.totalAssets > 0 ? ((business.totalLiabilities / business.totalAssets) * 100).toFixed(1) : 0,
      color: "#fa8c16",
    },
  ]

  return (
    <ConfigProvider direction="rtl">
      {/* <div style={{ marginTop: "100vh" }}></div> */}

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
                      <Title level={3} style={{ color: "white", margin: 0, textAlign: "right" }}>
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
                        style={{
                          height: "100%",
                          background: `${metric.color}08`,
                          border: `1px solid ${metric.color}30`,
                          borderRadius: 16,
                          "--metric-index": index,
                        } as React.CSSProperties}
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
                                color: String(metric.color),
                              }}
                            >
                              {metric.icon}
                            </Avatar>
                          </div>

                          <Statistic
                            value={metric.value}
                            prefix={metric.prefix}
                            valueStyle={{
                              color: String(metric.color),
                              fontSize: "1.8rem",
                              fontWeight: "bold",
                            }}
                          />

                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {getChangeIcon(metric.change ?? 0)}
                            {metric.change !== null && (
                              <Text
                                style={{
                                  color: metric.change > 0 ? "#52c41a" : "#ff4d4f",
                                  fontWeight: 600,
                                }}
                              >
                                {metric.change > 0 ? "+" : ""}
                                {metric.change}%
                              </Text>
                            )}
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
              {/* הצגת השגיאות */}
              {error && (
                <Alert
                  message="שגיאה בטעינת דוחות"
                  description={error.join(", ")}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16, borderRadius: 12 }}
                />
              )}

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
                              format={() => (
                                <div>
                                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: metric.color }}>
                                    {metric.value}
                                  </div>
                                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                                  </div>
                                </div>
                              )}
                              strokeColor={metric.color}
                              size={120}
                            />
                          </div>

                          <div style={{ textAlign: "center" }}>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
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
