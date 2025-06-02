import React, { useState, useEffect, useContext } from "react"
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Row,
  Col,
  message,
  Alert,
  Typography,
  Card,
} from "antd"
import axios from "axios"
import { globalContext } from "../context/GlobalContext"

const { Option } = Select
const { Text } = Typography

const transactionTypes = [
  { key: "Income", label: "הכנסה" },
  { key: "Expense", label: "הוצאה" },
  { key: "AssetIncrease", label: "הגדלת נכסים" },
  { key: "AssetDecrease", label: "הקטנת נכסים" },
  { key: "LiabilityIncrease", label: "הגדלת התחייבויות" },
  { key: "LiabilityDecrease", label: "הקטנת התחייבויות" },
  { key: "EquityIncrease", label: "הגדלת הון עצמי" },
  { key: "EquityDecrease", label: "הקטנת הון עצמי" },
]

const AccountTransactions: React.FC = () => {
  const globalContextDetails = useContext(globalContext)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const url = import.meta.env.VITE_API_URL
  const [totals, setTotals] = useState<{ debit: number; credit: number }>({
    debit: 0,
    credit: 0,
  })

  const user = {
    id: globalContextDetails.user.id,
    firstName: globalContextDetails.user.firstName,
    lastName: globalContextDetails.user.lastName,
    businessId: globalContextDetails.business_global.id,
  }

  const fetchTotals = async () => {
    try {
      const { data } = await axios.get(
        `${url}/api/Invoice/totals/${user.businessId}`,
        { withCredentials: true }
      )
      console.log("Fetched totals:", data);
      

      setTotals({ debit: data.totalDebit, credit: data.totalCredit })
    } catch (err) {
      console.error("Failed to fetch totals:", err)
    }
  }

  useEffect(() => {
    fetchTotals()
  }, [])

  const handleFinish = async (values: any) => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    let amountCredit = 0
    let amountDebit = 0

    switch (values.transactionType) {
      case "Income":
      case "LiabilityIncrease":
      case "EquityIncrease":
      case "AssetDecrease":
        amountCredit = values.amount
        break
      case "Expense":
      case "AssetIncrease":
      case "LiabilityDecrease":
      case "EquityDecrease":
        amountDebit = values.amount
        break
      default:
        break
    }

    const invoiceToSend = {
      id: 0,
      amountCredit,
      amountDebit,
      invoiceDate: new Date().toISOString(),
      status: 1,
      notes: values.description ?? "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: `${user.firstName} ${user.lastName}`,
      updatedBy: `${user.firstName} ${user.lastName}`,
      invoicePath: "",
      userId: user.id,
      businessId: user.businessId ?? 0,
      type: values.transactionType,
    }

    try {    
      await axios.post(`${url}/api/Invoice`, invoiceToSend, {
        withCredentials: true,
      })
      setSuccess(true)
      form.resetFields()
      message.success("התנועה נוספה בהצלחה!")
      await fetchTotals()
    } catch (err) {
      setError("אירעה שגיאה בשמירת התנועה.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div dir="rtl" style={{ maxWidth: 800, margin: "auto" }}>
      <h2>רישום פקודת יומן</h2>

      <Card style={{ marginBottom: 20 }}>
        <Text strong>סכומים נוכחיים בעסק:</Text>
        <Row gutter={16} style={{ marginTop: 10 }}>
          <Col span={12}>
            <Text type="success">
              חובה (סכום כולל): ₪
              {(totals.debit ?? 0).toLocaleString()}
            </Text>
          </Col>
          <Col span={12}>
            <Text type="danger">
              זכות (סכום כולל): ₪
              {(totals.credit ?? 0).toLocaleString()}
            </Text>
          </Col>
        </Row>
      </Card>

      {error && (
        <Alert message={error} type="error" style={{ marginBottom: 16 }} />
      )}
      {success && (
        <Alert
          message="התנועה נשמרה בהצלחה"
          type="success"
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="transactionType"
          label="סוג תנועה"
          rules={[{ required: true, message: "נא לבחור סוג תנועה" }]}
        >
          <Select placeholder="בחר סוג תנועה">
            {transactionTypes.map((type) => (
              <Option key={type.key} value={type.key}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="סכום"
          rules={[{ required: true, message: "נא להזין סכום" }]}
        >
          <InputNumber<number>
            placeholder="₪"
            style={{ width: "100%" }}
            min={0.01}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) =>
              parseFloat(value?.replace(/₪\s?|(,*)/g, "") || "0")
            }
          />
        </Form.Item>

        <Form.Item name="description" label="תיאור">
          <Input.TextArea rows={2} placeholder="הוסף תיאור (אופציונלי)" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          שמור פקודה
        </Button>
      </Form>
    </div>
  )
}

export default AccountTransactions
