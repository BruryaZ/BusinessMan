"use client"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import type { InvoiceDto } from "../models/InvoiceDto"
import { globalContext } from "../context/GlobalContext"
import {
  Form,
  InputNumber,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Alert,
  Statistic,
  ConfigProvider,
  Divider,
  Avatar,
  Spin,
} from "antd"
import {
  DollarOutlined,
  MinusCircleOutlined,
  SendOutlined,
  FileTextOutlined,
  WarningOutlined,
  DingdingOutlined,
  BarChartOutlined,
  ClearOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography

const IncomAndExpennses = () => {
  const [income, setIncome] = useState(0)
  const [expenditure, setExpenditure] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [financialSummary, setFinancialSummary] = useState<any[]>([])

  const globalContextDetails = useContext(globalContext)

  const fetchSummaryData = async () => {
    const businessId = globalContextDetails.user.businessId
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    try {
      const response = await axios.get(`https://localhost:7031/api/Reports/monthly?businessId=${businessId}&year=${year}&month=${month}`, {
        withCredentials: true,
      })

      const data = response.data

      const summary = [
        {
          title: "הכנסות החודש",
          amount: data.currentMonthIncome,
          change: data.incomeChangePercent,
          icon: <WarningOutlined />,
          color: "#52c41a",
        },
        {
          title: "הוצאות החודש",
          amount: data.currentMonthExpenses,
          change: data.expensesChangePercent,
          icon: <DingdingOutlined />,
          color: "#ff4d4f",
        },
        {
          title: "רווח נקי",
          amount: data.currentMonthNetProfit,
          change: data.netProfitChangePercent,
          icon: <BarChartOutlined />,
          color: "#1890ff",
        },
      ]

      setFinancialSummary(summary)
    } catch (err) {
      console.error("Failed to fetch financial summary", err)
      setError("שגיאה בטעינת סיכום פיננסי.")
    } finally {
      setSummaryLoading(false)
    }
  }

  useEffect(() => {
    fetchSummaryData()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    const invoiceToSend: InvoiceDto = {
      id: 0,
      amountDebit: expenditure,
      amountCredit: income,
      invoiceDate: new Date(),
      status: 1,
      notes: "",
      createdAt: new Date(),
      createdBy: globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName,
      updatedAt: new Date(),
      updatedBy: globalContextDetails.user.firstName + " " + globalContextDetails.user.lastName,
      invoicePath: "",
      userId: globalContextDetails.user.id,
      businessId: globalContextDetails.user.businessId ?? 0,
    }

    try {
      await axios.post("https://localhost:7031/api/Invoice", invoiceToSend, { withCredentials: true })
      setSuccess(true)
      setIncome(0)
      setExpenditure(0)
      fetchSummaryData() // טען מחדש את הסיכום אחרי שמירת תנועה
    } catch (error) {
      console.error("Error saving invoice:", error)
      setError("אירעה שגיאה בשמירת הנתונים. אנא נסה שנית.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setIncome(0)
    setExpenditure(0)
    setSuccess(false)
    setError(null)
  }

  return (
    <ConfigProvider direction="rtl">
      <div style={{ padding: "0 0 40px 0", marginTop: "80vh" }}>
        <Card className="form-section" style={{ marginBottom: 32 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Avatar
              size={80}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                marginBottom: 16,
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
              }}
            >
              <FileTextOutlined style={{ fontSize: 40 }} />
            </Avatar>

            <Title level={2} style={{ marginBottom: 8, color: "#2d3748" }}>
              ניהול הכנסות והוצאות
            </Title>

            <Text type="secondary" style={{ fontSize: 16 }}>
              הזן את ההכנסות וההוצאות של העסק שלך לניהול פיננסי יעיל
            </Text>

            <Divider />
          </div>

          {/* Financial Summary */}
          {summaryLoading ? (
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
              {financialSummary.map((item, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card className="financial-summary-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <Title level={5} style={{ margin: 0, color: "#2d3748" }}>
                        {item.title}
                      </Title>
                      <Avatar size={48} style={{ background: `${item.color}20`, color: item.color }}>
                        {item.icon}
                      </Avatar>
                    </div>
                    <Statistic
                      value={item.amount}
                      prefix="₪"
                      valueStyle={{ color: item.color, fontSize: "1.8rem", fontWeight: "bold" }}
                    />
                    <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                      <Text
                        style={{
                          color: item.change > 0 ? "#52c41a" : "#ff4d4f",
                          fontWeight: 600,
                          marginLeft: 8,
                        }}
                      >
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </Text>
                      <Text type="secondary">מהחודש הקודם</Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <Form layout="vertical" onFinish={handleSubmit}>
            <Title level={4} style={{ marginBottom: 24 }}>
              הוספת תנועה חדשה
            </Title>

            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Card className="income-card" style={{ height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                    <Avatar style={{ background: "#52c41a", color: "white", marginLeft: 12 }}>
                      <DollarOutlined />
                    </Avatar>
                    <Title level={5} style={{ margin: 0, color: "#389e0d" }}>
                      הכנסות
                    </Title>
                  </div>
                  <Form.Item label="סכום ההכנסה" required>
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="הזן סכום הכנסה"
                      value={income || undefined}
                      onChange={(value) => setIncome(value || 0)}
                      prefix="₪"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => parseFloat(value!.replace(/\$\s?|(,*)/g, "")) || 0}
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card className="expense-card" style={{ height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                    <Avatar style={{ background: "#ff4d4f", color: "white", marginLeft: 12 }}>
                      <MinusCircleOutlined />
                    </Avatar>
                    <Title level={5} style={{ margin: 0, color: "#cf1322" }}>
                      הוצאות
                    </Title>
                  </div>
                  <Form.Item label="סכום ההוצאה" required>
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="הזן סכום הוצאה"
                      value={expenditure || undefined}
                      onChange={(value) => setExpenditure(value || 0)}
                      prefix="₪"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => parseFloat(value!.replace(/\$\s?|(,*)/g, "")) || 0}
                    />
                  </Form.Item>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
              <Col xs={24} sm={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<SendOutlined />}
                  block
                  style={{ height: 48, fontWeight: 600, fontSize: 16 }}
                >
                  שמור נתונים
                </Button>
              </Col>

              <Col xs={24} sm={12}>
                <Button
                  type="default"
                  size="large"
                  onClick={handleReset}
                  icon={<ClearOutlined />}
                  block
                  style={{ height: 48, fontWeight: 600, borderWidth: 2 }}
                >
                  נקה טופס
                </Button>
              </Col>
            </Row>

            {success && (
              <Alert
                message="הנתונים נשמרו בהצלחה!"
                description="התנועה הפיננסית נוספה למערכת בהצלחה."
                type="success"
                showIcon
                style={{ marginTop: 24, borderRadius: 8, border: "1px solid #b7eb8f" }}
              />
            )}

            {error && (
              <Alert
                message="שגיאה!"
                description={error}
                type="error"
                showIcon
                style={{ marginTop: 24, borderRadius: 8, border: "1px solid #ffccc7" }}
              />
            )}
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default IncomAndExpennses
