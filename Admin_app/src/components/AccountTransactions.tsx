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
  Table,
  Space,
  Statistic,
  Tag,
  Tabs,
  Badge,
  Tooltip,
  DatePicker,
  Empty,
  Avatar,
  Grid,
  FloatButton,
} from "antd"
import {
  DollarOutlined,
  PlusOutlined,
  HistoryOutlined,
  CalculatorOutlined,
  FileTextOutlined,
  TagOutlined,
  UserOutlined,
  ReloadOutlined,
  ExportOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import axios from "axios"
import { globalContext } from "../context/GlobalContext"
import { InvoiceDto } from "../models/InvoiceDto"
import dayjs from "dayjs"
import { TrendingUpOutlined, TrendingDownOutlined } from "@mui/icons-material"
import { InvoiceType } from "../models/Invoices"

const { Option } = Select
const { Text, Title } = Typography
const { RangePicker } = DatePicker
const { useBreakpoint } = Grid

interface Totals {
  debit: number
  credit: number
}

const transactionTypes = [
  { key: "Income", label: "הכנסה", color: "#52c41a", icon: <TrendingUpOutlined /> },
  { key: "Expense", label: "הוצאה", color: "#ff4d4f", icon: <TrendingDownOutlined /> },
  { key: "AssetIncrease", label: "הגדלת נכסים", color: "#1890ff", icon: <TrendingUpOutlined /> },
  { key: "AssetDecrease", label: "הקטנת נכסים", color: "#fa8c16", icon: <TrendingDownOutlined /> },
  { key: "LiabilityIncrease", label: "הגדלת התחייבויות", color: "#722ed1", icon: <TrendingUpOutlined /> },
  { key: "LiabilityDecrease", label: "הקטנת התחייבויות", color: "#eb2f96", icon: <TrendingDownOutlined /> },
  { key: "EquityIncrease", label: "הגדלת הון עצמי", color: "#13c2c2", icon: <TrendingUpOutlined /> },
  { key: "EquityDecrease", label: "הקטנת הון עצמי", color: "#faad14", icon: <TrendingDownOutlined /> },
  { key: "Revenue", label: "הכנסות נוספות", color: "#52c41a", icon: <DollarOutlined /> },
  { key: "CostOfGoodsSold", label: "עלות סחורה", color: "#ff7a45", icon: <CalculatorOutlined /> },
  { key: "OtherIncome", label: "הכנסה אחרת", color: "#36cfc9", icon: <TrendingUpOutlined /> },
  { key: "OtherExpense", label: "הוצאה אחרת", color: "#ff85c0", icon: <TrendingDownOutlined /> },
]

const AccountTransactions: React.FC = () => {
  const globalContextDetails = useContext(globalContext)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<InvoiceDto[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<InvoiceDto[]>([])
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("1")
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [selectedType, setSelectedType] = useState<InvoiceType | undefined>(undefined)

  const url = import.meta.env.VITE_API_URL
  const screens = useBreakpoint()

  const [totals, setTotals] = useState<Totals>({
    debit: 0,
    credit: 0,
  })

  const user = {
    id: globalContextDetails.user.id,
    firstName: globalContextDetails.user.firstName,
    lastName: globalContextDetails.user.lastName,
    businessId: globalContextDetails.business_global.id,
  }

  const getTransactionTypeInfo = (type: string) => {
    return transactionTypes.find(t => t.key === type) ||
      { key: type, label: type, color: "#8c8c8c", icon: <FileTextOutlined /> }
  }

  const fetchTotals = async (): Promise<void> => {
    try {
      const { data } = await axios.get<{ totalDebit: number; totalCredit: number }>(
        `${url}/api/Invoice/totals/${user.businessId}`,
        { withCredentials: true }
      )
      setTotals({ debit: data.totalDebit, credit: data.totalCredit })
    } catch (err) {
      console.error("Failed to fetch totals:", err)
      message.error("שגיאה בטעינת הסכומים")
    }
  }

  const GetAllTransactions = async (): Promise<void> => {
    setTransactionsLoading(true)
    try {
      const { data } = await axios.get<InvoiceDto[]>(
        `${url}/api/Invoice/my-files`,
        { withCredentials: true }
      )
      setTransactions(data)
      setFilteredTransactions(data)
      message.success(`נטענו ${data.length} תנועות`)
    } catch (err) {
      console.error("Failed to fetch transactions:", err)
      message.error("אירעה שגיאה בעת טעינת התנועות.")
    } finally {
      setTransactionsLoading(false)
    }
  }

  const handleFinish = async (values: any): Promise<void> => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    const amount = Number(values.amount)
    
    // בדיקת תקינות סכום
    if (!amount || amount <= 0) {
      setError("נא להזין סכום תקין הגדול מאפס")
      setLoading(false)
      return
    }

    console.log("ערכי הטופס:", values)
    console.log("סכום לאחר המרה:", amount)
    console.log("סוג התנועה:", values.transactionType)

    const invoiceToSend: Partial<InvoiceDto> = {
      id: 0,
      amount: amount,
      amountDebit: amount,
      amountCredit: amount,
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
      type: values.transactionType,
    }

    console.log("אובייקט החשבונית לשליחה:", JSON.stringify(invoiceToSend, null, 2))

    try {
      const response = await axios.post(`${url}/api/Invoice`, invoiceToSend, {
        withCredentials: true,
      })
      
      console.log("תשובת השרת:", response.data)
      
      setSuccess(true)
      form.resetFields()
      message.success("התנועה נוספה בהצלחה!")
      await fetchTotals()
      if (activeTab === "2") {
        await GetAllTransactions()
      }
    } catch (err: any) {
      console.error("שגיאה בשמירת התנועה:", err)
      console.log("פרטי השגיאה:", err.response?.data)
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data || 
                          err.message || 
                          "אירעה שגיאה בשמירת התנועה."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (): void => {
    let filtered = [...transactions]

    if (dateRange) {
      filtered = filtered.filter(transaction => {
        const transactionDate = dayjs(transaction.invoiceDate)
        return transactionDate.isAfter(dateRange[0], 'day') &&
          transactionDate.isBefore(dateRange[1], 'day')
      })
    }

    if (selectedType) {
      filtered = filtered.filter(transaction => transaction.type === selectedType)
    }

    setFilteredTransactions(filtered)
  }

  const clearFilters = (): void => {
    setDateRange(null)
    setSelectedType(undefined)
    setFilteredTransactions(transactions)
  }

  const formatCurrency = (amount: number): string => {
    return `₪${amount.toLocaleString('he-IL', { minimumFractionDigits: 2 })}`
  }

  useEffect(() => {
    fetchTotals()
    GetAllTransactions()
  }, [])

  useEffect(() => {
    handleFilter()
  }, [dateRange, selectedType, transactions])

  const columns: ColumnsType<InvoiceDto> = [
    {
      title: "תאריך",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      width: screens.xs ? 100 : 130,
      render: (date: string) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ fontSize: 13 }}>
            {dayjs(date).format('DD/MM/YY')}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {dayjs(date).format('HH:mm')}
          </Text>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.invoiceDate).unix() - dayjs(b.invoiceDate).unix(),
    },
    {
      title: "סוג תנועה",
      dataIndex: "type",
      key: "type",
      width: screens.xs ? 120 : 160,
      render: (type: string) => {
        const typeInfo = getTransactionTypeInfo(type)
        return (
          <Tag
            color={typeInfo.color}
            icon={typeInfo.icon}
            style={{ fontSize: screens.xs ? 11 : 12 }}
          >
            {typeInfo.label}
          </Tag>
        )
      },
      filters: transactionTypes.map(type => ({
        text: type.label,
        value: type.key,
      })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "סכום",
      dataIndex: "amount",
      key: "amount",
      width: screens.xs ? 100 : 120,
      align: "center",
      render: (amount: number) => (
        <Text
          strong
          style={{
            color: amount > 0 ? "#52c41a" : "#ff4d4f",
            fontSize: screens.xs ? 13 : 14
          }}
        >
          {formatCurrency(amount)}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "חובה",
      dataIndex: "amountDebit",
      key: "amountDebit",
      width: screens.xs ? 80 : 100,
      align: "center",
      render: (amountDebit: number) => (
        <Text
          style={{
            color: amountDebit > 0 ? "#ff4d4f" : "#8c8c8c",
            fontSize: screens.xs ? 12 : 13
          }}
        >
          {amountDebit > 0 ? formatCurrency(amountDebit) : "-"}
        </Text>
      ),
    },
    {
      title: "זכות",
      dataIndex: "amountCredit",
      key: "amountCredit",
      width: screens.xs ? 80 : 100,
      align: "center",
      render: (amountCredit: number) => (
        <Text
          style={{
            color: amountCredit > 0 ? "#52c41a" : "#8c8c8c",
            fontSize: screens.xs ? 12 : 13
          }}
        >
          {amountCredit > 0 ? formatCurrency(amountCredit) : "-"}
        </Text>
      ),
    },
    {
      title: "תיאור",
      dataIndex: "notes",
      key: "notes",
      ellipsis: { showTitle: false },
      render: (notes: string) => (
        <Tooltip title={notes || "ללא תיאור"}>
          <Text style={{ fontSize: screens.xs ? 12 : 13 }}>
            {notes || "ללא תיאור"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "נוצר על ידי",
      dataIndex: "createdBy",
      key: "createdBy",
      width: screens.xs ? 100 : 130,
      render: (createdBy: string) => (
        <Space size="small">
          <Avatar size="small" icon={<UserOutlined />} />
          <Text style={{ fontSize: screens.xs ? 11 : 12 }}>{createdBy}</Text>
        </Space>
      ),
    },
  ]

  const statisticsCards = (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={8}>
        <Card size="small" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <Statistic
            title={<Text style={{ color: "white", fontWeight: 600 }}>סכום חובה</Text>}
            value={totals.debit}
            precision={2}
            valueStyle={{ color: "white", fontSize: screens.xs ? 18 : 24 }}
            prefix={<TrendingUpOutlined style={{ color: "white" }} />}
            suffix="₪"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card size="small" style={{ background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" }}>
          <Statistic
            title={<Text style={{ color: "#8b4513", fontWeight: 600 }}>סכום זכות</Text>}
            value={totals.credit}
            precision={2}
            valueStyle={{ color: "#8b4513", fontSize: screens.xs ? 18 : 24 }}
            prefix={<TrendingDownOutlined style={{ color: "#8b4513" }} />}
            suffix="₪"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          />
        </Card>
        
      </Col>
      <Col xs={24} sm={24} lg={8}>
        <Card size="small" style={{ background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" }}>
          <Statistic
            title={<Text style={{ color: "#2d3748", fontWeight: 600 }}>כמות התנועות בחשבון</Text>}
            value={transactions.length}
            precision={0}
            valueStyle={{
              color: (totals.debit - totals.credit) >= 0 ? "#52c41a" : "#ff4d4f",
              fontSize: screens.xs ? 18 : 24
            }}
            prefix={<ReconciliationOutlined />}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          />
        </Card>
      </Col>
    </Row>
  )

  return (
    <div dir="rtl" style={{
      padding: screens.xs ? "16px 8px" : "24px 16px",
      maxWidth: 1400,
      margin: "0 auto",
      minHeight: "100vh",
      background: "#f5f5f5"
    }}>
      <Card style={{
        borderRadius: 12,
        marginBottom: 24,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar
            size={screens.xs ? 48 : 64}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              marginBottom: 16,
            }}
          >
            <DollarOutlined style={{ fontSize: screens.xs ? 24 : 32 }} />
          </Avatar>

          <Title level={screens.xs ? 3 : 2} style={{ marginBottom: 8, color: "#2d3748" }}>
            ניהול תנועות חשבון
          </Title>

          <Text type="secondary" style={{ fontSize: screens.xs ? 14 : 16 }}>
            רישום ועקיבה אחר תנועות כספיות בעסק
          </Text>
        </div>

        {statisticsCards}
      </Card>

      <Card style={{
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size={screens.xs ? "small" : "middle"}
          items={[
            {
              key: "1",
              label: (
                <Space>
                  <PlusOutlined />
                  <span>רישום תנועה חדשה</span>
                </Space>
              ),
              children: (
                <div style={{ maxWidth: 600, margin: "0 auto" }}>
                  {error && (
                    <Alert
                      message={error}
                      type="error"
                      style={{ marginBottom: 16 }}
                      showIcon
                      closable
                      onClose={() => setError(null)}
                    />
                  )}

                  {success && (
                    <Alert
                      message="התנועה נשמרה בהצלחה"
                      type="success"
                      style={{ marginBottom: 16 }}
                      showIcon
                      closable
                      onClose={() => setSuccess(false)}
                    />
                  )}

                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    size={screens.xs ? "small" : "middle"}
                  >
                    <Form.Item
                      name="transactionType"
                      label={
                        <Space>
                          <TagOutlined />
                          <span>סוג תנועה</span>
                        </Space>
                      }
                      rules={[{ required: true, message: "נא לבחור סוג תנועה" }]}
                    >
                      <Select
                        placeholder="בחר סוג תנועה"
                        showSearch
                        optionFilterProp="children"
                      >
                        {transactionTypes.map((type) => (
                          <Option key={type.key} value={type.key}>
                            <Space>
                              {type.icon}
                              {type.label}
                            </Space>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="amount"
                      label={
                        <Space>
                          <DollarOutlined />
                          <span>סכום</span>
                        </Space>
                      }
                      rules={[
                        { required: true, message: "נא להזין סכום" },
                        {
                          type: "number",
                          min: 0.01,
                          message: "הסכום חייב להיות גדול מאפס",
                        },
                      ]}
                    >
                      <InputNumber<number>
                        placeholder="הזן סכום"
                        style={{ width: "100%" }}
                        min={0.01}
                        size="large"
                        formatter={(value) =>
                          `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) =>
                          parseFloat(value?.replace(/₪\s?|(,*)/g, "") || "0")
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label={
                        <Space>
                          <FileTextOutlined />
                          <span>תיאור</span>
                        </Space>
                      }
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="הוסף תיאור (אופציונלי)"
                        showCount
                        maxLength={200}
                      />
                    </Form.Item>

                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      size="large"
                      style={{
                        height: 48,
                        fontWeight: 600,
                        borderRadius: 8
                      }}
                    >
                      <Space>
                        <PlusOutlined />
                        שמור תנועה
                      </Space>
                    </Button>
                  </Form>
                </div>
              )
            },
            {
              key: "2",
              label: (
                <Space>
                  <HistoryOutlined />
                  <span>היסטוריית תנועות</span>
                  <Badge count={transactions.length} showZero />
                </Space>
              ),
              children: (
                <div>
                  {/* מסנני חיפוש */}
                  <Card size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} sm={12} md={8}>
                        <Space direction="vertical" size="small" style={{ width: "100%" }}>
                          <Text strong>סינון לפי תאריך:</Text>
                          <RangePicker
                            value={dateRange}
                            onChange={(dates) => {
                              if (dates) {
                                const [start, end] = dates;
                                setDateRange(start && end ? [start, end] : null);
                              } else {
                                setDateRange(null);
                              }
                            }}
                            style={{ width: "100%" }}
                            placeholder={["מתאריך", "עד תאריך"]}
                            format="DD/MM/YYYY"
                          />
                        </Space>
                      </Col>

                      <Col xs={24} sm={12} md={8}>
                        <Space direction="vertical" size="small" style={{ width: "100%" }}>
                          <Text strong>סינון לפי סוג:</Text>
                          <Select
                            value={selectedType}
                            onChange={setSelectedType}
                            placeholder="כל הסוגים"
                            style={{ width: "100%" }}
                            allowClear
                          >
                            {transactionTypes.map((type) => (
                              <Option key={type.key} value={type.key}>
                                <Space>
                                  {type.icon}
                                  {type.label}
                                </Space>
                              </Option>
                            ))}
                          </Select>
                        </Space>
                      </Col>

                      <Col xs={24} sm={24} md={8}>
                        <Space style={{ width: "100%" }}>
                          <Button
                            onClick={clearFilters}
                            icon={<ReloadOutlined />}
                          >
                            נקה מסננים
                          </Button>
                          <Button
                            onClick={GetAllTransactions}
                            icon={<ReloadOutlined />}
                            loading={transactionsLoading}
                          >
                            רענן
                          </Button>
                          <Tooltip title="יחזור בקרוב">
                            <Button
                              icon={<ExportOutlined />}
                              disabled
                            >
                              ייצא
                            </Button>
                          </Tooltip>
                        </Space>
                      </Col>
                    </Row>
                  </Card>

                  {/* טבלת תנועות */}
                  <Card style={{ borderRadius: 8 }}>
                    {filteredTransactions.length > 0 ? (
                      <Table
                        columns={columns}
                        dataSource={filteredTransactions}
                        rowKey="id"
                        loading={transactionsLoading}
                        pagination={{
                          pageSize: screens.xs ? 5 : 10,
                          showSizeChanger: !screens.xs,
                          showQuickJumper: !screens.xs,
                          showTotal: (total, range) =>
                            `${range[0]}-${range[1]} מתוך ${total} תנועות`,
                          size: screens.xs ? "small" : "default",
                        }}
                        scroll={{
                          x: screens.xs ? 600 : 800
                        }}
                        size={screens.xs ? "small" : "middle"}
                        rowClassName={(_record, index) =>
                          index % 2 === 0 ? "table-row-light" : "table-row-dark"
                        }
                      />
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <div>
                            <Text type="secondary" style={{ fontSize: 16 }}>
                              לא נמצאו תנועות
                            </Text>
                            <br />
                            <Text type="secondary">
                              נסה לשנות את המסננים או הוסף תנועה חדשה
                            </Text>
                          </div>
                        }
                        style={{ padding: "40px 0" }}
                      />
                    )}
                  </Card>
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* כפתור צף */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ left: 24 }}
        icon={<PlusOutlined />}
      >
        <FloatButton
          icon={<PlusOutlined />}
          tooltip="תנועה חדשה"
          onClick={() => setActiveTab("1")}
        />
        <FloatButton
          icon={<HistoryOutlined />}
          tooltip="היסטוריית תנועות"
          onClick={() => setActiveTab("2")}
        />
        <FloatButton
          icon={<ReloadOutlined />}
          tooltip="רענן נתונים"
          onClick={() => {
            fetchTotals()
            GetAllTransactions()
          }}
        />
      </FloatButton.Group>

      {/* סטיילים מותאמים */}
      <style >{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
        
        @media (max-width: 576px) {
          .ant-table-thead > tr > th {
            padding: 8px 4px !important;
            font-size: 12px !important;
          }
          .ant-table-tbody > tr > td {
            padding: 8px 4px !important;
          }
          .ant-statistic-title {
            font-size: 12px !important;
          }
          .ant-statistic-content {
            font-size: 16px !important;
          }
        }
        
        .ant-card {
          transition: all 0.3s ease;
        }
        
        .ant-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  )
}

export default AccountTransactions