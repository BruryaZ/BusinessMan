"use client"

import { useContext, useEffect, useState } from "react"
import axios from "axios"
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
  Select,
  Spin,
  Input,
} from "antd"
import {
  FileTextOutlined,
  WarningOutlined,
  DingdingOutlined,
  BarChartOutlined,
  SendOutlined,
  ClearOutlined,
  TagsOutlined,
} from "@ant-design/icons"

import { globalContext } from "../context/GlobalContext"
import { InvoiceType } from "../models/Invoices"
import type { InvoiceDto } from "../models/InvoiceDto"

const { Title, Text } = Typography
const { Option } = Select

const invoiceTypes = [
  { value: InvoiceType.Income, label: "הכנסה" },
  { value: InvoiceType.Expense, label: "הוצאה" },
  { value: InvoiceType.AssetIncrease, label: "עלייה בנכסים" },
  { value: InvoiceType.AssetDecrease, label: "ירידה בנכסים" },
  { value: InvoiceType.LiabilityIncrease, label: "עלייה בהתחייבויות" },
  { value: InvoiceType.LiabilityDecrease, label: "ירידה בהתחייבויות" },
  { value: InvoiceType.EquityIncrease, label: "עלייה בהון עצמי" },
  { value: InvoiceType.EquityDecrease, label: "ירידה בהון עצמי" },
]

const IncomAndExpenses = () => {
  const { user } = useContext(globalContext)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [financialSummary, setFinancialSummary] = useState<any[]>([])

  const fetchSummaryData = async () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    try {
      const response = await axios.get(`https://localhost:7031/api/Reports/monthly?businessId=${user.businessId}&year=${year}&month=${month}`, {
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
          title: "רווח תפעולי",
          amount: data.currentMonthNetProfit,
          change: data.netProfitChangePercent,
          icon: <BarChartOutlined />,
          color: "#1890ff",
        },
      ]

      setFinancialSummary(summary)
    } catch (err) {
      setError("שגיאה בטעינת הסיכום הפיננסי")
    } finally {
      setSummaryLoading(false)
    }
  }

  useEffect(() => {
    fetchSummaryData()
  }, [])

  const handleFinish = async (values: any) => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    const invoiceToSend: InvoiceDto = {
      id: 0,
      amountCredit: [InvoiceType.Income, InvoiceType.AssetIncrease, InvoiceType.EquityIncrease].includes(values.type)
        ? values.amount
        : 0,
      amountDebit: [InvoiceType.Expense, InvoiceType.AssetDecrease, InvoiceType.LiabilityIncrease, InvoiceType.LiabilityDecrease, InvoiceType.EquityDecrease].includes(values.type)
        ? values.amount
        : 0,
      invoiceDate: new Date(),
      status: 1,
      notes: values.description ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: `${user.firstName} ${user.lastName}`,
      updatedBy: `${user.firstName} ${user.lastName}`,
      invoicePath: "",
      userId: user.id,
      businessId: user.businessId ?? 0,
      type: values.type,
    }

    try {
      await axios.post("https://localhost:7031/api/Invoice", invoiceToSend, {
        withCredentials: true,
      })
      setSuccess(true)
      form.resetFields()
      fetchSummaryData()
    } catch (err) {
      setError("אירעה שגיאה בשמירת התנועה.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfigProvider direction="rtl">
      <div style={{ paddingBottom: 40 }}>
        <Card style={{ marginBottom: 32 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Avatar size={80} style={{ background: "#667eea", marginBottom: 16 }}>
              <FileTextOutlined style={{ fontSize: 40 }} />
            </Avatar>
            <Title level={2}>ניהול תנועות פיננסיות</Title>
            <Text type="secondary">הזן תנועה חדשה לעסק</Text>
            <Divider />
          </div>

          {summaryLoading ? (
            <Spin size="large" style={{ display: "block", margin: "0 auto" }} />
          ) : (
            <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
              {financialSummary.map((item, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                      <Title level={5}>{item.title}</Title>
                      <Avatar style={{ backgroundColor: item.color }}>{item.icon}</Avatar>
                    </div>
                    <Statistic value={item.amount} prefix="₪" valueStyle={{ color: item.color }} />
                    <Text type="secondary">{item.change > 0 ? "+" : ""}{item.change}% מהחודש הקודם</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="type"
                  label="סוג תנועה"
                  rules={[{ required: true, message: "נא לבחור סוג תנועה" }]}
                >
                  <Select placeholder="בחר סוג" suffixIcon={<TagsOutlined />}>
                    {invoiceTypes.map((item) => (
                      <Option key={item.value} value={item.value}>{item.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="amount"
                  label="סכום"
                  rules={[{ required: true, message: "נא להזין סכום" }]}
                >
                  <InputNumber
                    placeholder="₪"
                    style={{ width: "100%" }}
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => {
                      const parsedValue = parseFloat(value?.replace(/₪\s?|(,*)/g, "") || "0");
                      return isNaN(parsedValue) ? 0 : (parsedValue as 0);
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="description" label="תיאור">
                  <Input.TextArea rows={2} placeholder="הוסף תיאור (אופציונלי)" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}
                  block
                  size="large"
                >
                  שמור תנועה
                </Button>
              </Col>

              <Col xs={24} sm={12}>
                <Button
                  type="default"
                  onClick={() => {
                    form.resetFields()
                    setSuccess(false)
                    setError(null)
                  }}
                  icon={<ClearOutlined />}
                  block
                  size="large"
                >
                  נקה טופס
                </Button>
              </Col>
            </Row>

            {success && (
              <Alert
                message="הצלחה"
                description="התנועה נשמרה בהצלחה."
                type="success"
                showIcon
                style={{ marginTop: 24 }}
              />
            )}

            {error && (
              <Alert
                message="שגיאה"
                description={error}
                type="error"
                showIcon
                style={{ marginTop: 24 }}
              />
            )}
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default IncomAndExpenses
