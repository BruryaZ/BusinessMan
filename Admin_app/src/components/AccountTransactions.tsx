// "use client"

// import type React from "react"
// import { useState, useEffect, useContext } from "react"
// import {
//   Form,
//   Input,
//   InputNumber,
//   Button,
//   Select,
//   Row,
//   Col,
//   message,
//   Alert,
//   Typography,
//   Card,
//   Table,
//   Space,
//   Statistic,
//   Tag,
//   DatePicker,
//   Tabs,
//   Empty,
//   Tooltip,
//   Avatar,
// } from "antd"
// import {
//   PlusOutlined,
//   DollarOutlined,
//   FileTextOutlined,
//   CalendarOutlined,
//   UserOutlined,
//   EyeOutlined,
//   FilterOutlined,
// } from "@ant-design/icons"
// import axios from "axios"
// import { globalContext } from "../context/GlobalContext"
// import type { InvoiceDto } from "../models/InvoiceDto"
// import type { ColumnsType } from "antd/es/table"
// import dayjs from "dayjs"
// import { InvoiceType } from "../models/Invoices"
// import { TrendingUpOutlined, TrendingDownOutlined } from "@mui/icons-material"

// const { Option } = Select
// const { Text, Title } = Typography
// const { TabPane } = Tabs
// const { RangePicker } = DatePicker

// const transactionTypes = [
//   { key: "Income", label: "הכנסה", color: "#52c41a", icon: <TrendingUpOutlined /> },
//   { key: "Expense", label: "הוצאה", color: "#ff4d4f", icon: <TrendingDownOutlined /> },
//   { key: "AssetIncrease", label: "הגדלת נכסים", color: "#1890ff", icon: <TrendingUpOutlined /> },
//   { key: "AssetDecrease", label: "הקטנת נכסים", color: "#fa8c16", icon: <TrendingDownOutlined /> },
//   { key: "LiabilityIncrease", label: "הגדלת התחייבויות", color: "#722ed1", icon: <TrendingUpOutlined /> },
//   { key: "LiabilityDecrease", label: "הקטנת התחייבויות", color: "#eb2f96", icon: <TrendingDownOutlined /> },
//   { key: "EquityIncrease", label: "הגדלת הון עצמי", color: "#13c2c2", icon: <TrendingUpOutlined /> },
//   { key: "EquityDecrease", label: "הקטנת הון עצמי", color: "#faad14", icon: <TrendingDownOutlined /> },
//   { key: "Revenue", label: "הכנסות נוספות", color: "#52c41a", icon: <DollarOutlined /> },
//   { key: "CostOfGoodsSold", label: "עלות סחורה", color: "#ff7a45", icon: <FileTextOutlined /> },
//   { key: "OtherIncome", label: "הכנסה אחרת", color: "#36cfc9", icon: <TrendingUpOutlined /> },
//   { key: "OtherExpense", label: "הוצאה אחרת", color: "#ff85c0", icon: <TrendingDownOutlined /> },
// ]

// const AccountTransactions: React.FC = () => {
//   const globalContextDetails = useContext(globalContext)
//   const [form] = Form.useForm()
//   const [loading, setLoading] = useState(false)
//   const [transactionsLoading, setTransactionsLoading] = useState(false)
//   const [transactions, setTransactions] = useState<InvoiceDto[]>([])
//   const [filteredTransactions, setFilteredTransactions] = useState<InvoiceDto[]>([])
//   const [success, setSuccess] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [activeTab, setActiveTab] = useState("1")
//   const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
//   const [typeFilter, setTypeFilter] = useState<InvoiceType | undefined>(undefined)
//   const [isMobile, setIsMobile] = useState(false)

//   const url = import.meta.env.VITE_API_URL
//   const [totals, setTotals] = useState<{ debit: number; credit: number }>({
//     debit: 0,
//     credit: 0,
//   })

//   const user = {
//     id: globalContextDetails.user.id,
//     firstName: globalContextDetails.user.firstName,
//     lastName: globalContextDetails.user.lastName,
//     businessId: globalContextDetails.business_global.id,
//   }

//   // Check if mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//     }

//     checkMobile()
//     window.addEventListener("resize", checkMobile)
//     return () => window.removeEventListener("resize", checkMobile)
//   }, [])

//   useEffect(() => {
//     filterTransactions()
//   }, [transactions, dateRange, typeFilter])

//   const fetchTotals = async () => {
//     try {
//       const { data } = await axios.get(`${url}/api/Invoice/totals/${user.businessId}`, { withCredentials: true })
//       setTotals({ debit: data.totalDebit, credit: data.totalCredit })
//     } catch (err) {
//       console.error("Failed to fetch totals:", err)
//     }
//   }

//   const GetAllTransactions = async () => {
//     setTransactionsLoading(true)
//     try {
//       const { data } = await axios.get(`${url}/api/Invoice/my-files`, { withCredentials: true })
//       setTransactions(data)
//       message.success("התנועות נטענו בהצלחה")
//     } catch (err) {
//       console.error("Failed to fetch transactions:", err)
//       message.error("אירעה שגיאה בעת טעינת התנועות.")
//     } finally {
//       setTransactionsLoading(false)
//     }
//   }

//   const filterTransactions = () => {
//     let filtered = transactions

//     if (dateRange) {
//       filtered = filtered.filter((transaction) => {
//         const transactionDate = dayjs(transaction.invoiceDate)
//         return transactionDate.isAfter(dateRange[0]) && transactionDate.isBefore(dateRange[1])
//       })
//     }

//     if (typeFilter) {
//       filtered = filtered.filter((transaction) => transaction.type === typeFilter)
//     }

//     setFilteredTransactions(filtered)
//   }

//   const getTransactionTypeInfo = (type: InvoiceType) => {
//     return transactionTypes.find((t) => t.key === String(type)) || transactionTypes[0]
//   }

//   useEffect(() => {
//     fetchTotals()
//     if (activeTab === "2") {
//       GetAllTransactions()
//     }
//   }, [activeTab])

//   const handleFinish = async (values: any) => {
//     setLoading(true)
//     setSuccess(false)
//     setError(null)

//     if (!values.amount || values.amount <= 0) {
//       setError("נא להזין סכום תקין הגדול מאפס")
//       setLoading(false)
//       return
//     }

//     const invoiceToSend = {
//       id: 0,
//       amount: values.amount,
//       invoiceDate: new Date().toISOString(),
//       status: 1,
//       notes: values.description ?? "",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       createdBy: `${user.firstName} ${user.lastName}`,
//       updatedBy: `${user.firstName} ${user.lastName}`,
//       invoicePath: "",
//       userId: user.id,
//       businessId: user.businessId ?? 0,
//       type: values.transactionType,
//     }

//     try {
//       await axios.post(`${url}/api/Invoice`, invoiceToSend, {
//         withCredentials: true,
//       })
//       setSuccess(true)
//       form.resetFields()
//       message.success("התנועה נוספה בהצלחה!")
//       await fetchTotals()
//       if (activeTab === "2") {
//         await GetAllTransactions()
//       }
//     } catch (err) {
//       setError("אירעה שגיאה בשמירת התנועה.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const columns: ColumnsType<InvoiceDto> = [
//     {
//       title: "תאריך",
//       dataIndex: "invoiceDate",
//       key: "invoiceDate",
//       render: (date: string) => (
//         <Space>
//           <CalendarOutlined style={{ color: "#1890ff" }} />
//           <Text>{dayjs(date).format("DD/MM/YYYY")}</Text>
//         </Space>
//       ),
//       sorter: (a, b) => dayjs(a.invoiceDate).unix() - dayjs(b.invoiceDate).unix(),
//     },
//     {
//       title: "סוג תנועה",
//       dataIndex: "type",
//       key: "type",
//       render: (type: InvoiceType) => {
//         const typeInfo = getTransactionTypeInfo(type)
//         return (
//           <Tag color={typeInfo.color} icon={typeInfo.icon}>
//             {typeInfo.label}
//           </Tag>
//         )
//       },
//       filters: transactionTypes.map((type) => ({ text: type.label, value: type.key })),
//       onFilter: (value, record) => record.type === value,
//     },
//     {
//       title: "סכום",
//       dataIndex: "amount",
//       key: "amount",
//       render: (amount: number) => (
//         <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
//           ₪{amount.toLocaleString()}
//         </Text>
//       ),
//       sorter: (a, b) => a.amount - b.amount,
//     },
//     {
//       title: "תיאור",
//       dataIndex: "notes",
//       key: "notes",
//       render: (notes: string) => (
//         <Text ellipsis={{ tooltip: notes }} style={{ maxWidth: 200 }}>
//           {notes || "אין תיאור"}
//         </Text>
//       ),
//     },
//     {
//       title: "נוצר על ידי",
//       dataIndex: "createdBy",
//       key: "createdBy",
//       responsive: ["md"],
//       render: (createdBy: string) => (
//         <Space>
//           <Avatar size="small" icon={<UserOutlined />} />
//           <Text>{createdBy}</Text>
//         </Space>
//       ),
//     },
//     {
//       title: "פעולות",
//       key: "actions",
//       render: (_) => (
//         <Tooltip title="צפה בפרטים">
//           <Button type="text" icon={<EyeOutlined />} size="small" />
//         </Tooltip>
//       ),
//     },
//   ]

//   const TransactionCard: React.FC<{ transaction: InvoiceDto }> = ({ transaction }) => {
//     const typeInfo = getTransactionTypeInfo(transaction.type)

//     return (
//       <Card
//         size="small"
//         style={{
//           marginBottom: 12,
//           borderRadius: 8,
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Row align="middle" gutter={[12, 12]}>
//           <Col flex="none">
//             <Avatar style={{ backgroundColor: typeInfo.color }} icon={typeInfo.icon} />
//           </Col>
//           <Col flex="auto">
//             <div>
//               <Text strong>{typeInfo.label}</Text>
//               <br />
//               <Text type="secondary" style={{ fontSize: 12 }}>
//                 {dayjs(transaction.invoiceDate).format("DD/MM/YYYY")}
//               </Text>
//             </div>
//           </Col>
//           <Col flex="none">
//             <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
//               ₪{transaction.amount.toLocaleString()}
//             </Text>
//           </Col>
//         </Row>
//         {transaction.notes && (
//           <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
//             <Text type="secondary" style={{ fontSize: 12 }}>
//               {transaction.notes}
//             </Text>
//           </div>
//         )}
//       </Card>
//     )
//   }

//   return (
//     <div
//       style={{
//         padding: isMobile ? "16px" : "24px",
//         maxWidth: 1200,
//         margin: "0 auto",
//         minHeight: "100vh",
//         background: "#f5f5f5",
//       }}
//     >
//       {/* Header */}
//       <Card
//         style={{
//           marginBottom: 24,
//           borderRadius: 16,
//           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
//         }}
//       >
//         <Row align="middle" gutter={[16, 16]}>
//           <Col xs={24} md={16}>
//             <Space direction={isMobile ? "vertical" : "horizontal"} size="middle">
//               <Avatar
//                 size={isMobile ? 56 : 64}
//                 style={{
//                   background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
//                 }}
//               >
//                 <DollarOutlined style={{ fontSize: isMobile ? 28 : 32 }} />
//               </Avatar>
//               <div style={{ textAlign: isMobile ? "center" : "right" }}>
//                 <Title level={isMobile ? 3 : 2} style={{ margin: 0, color: "#2d3748" }}>
//                   ניהול תנועות חשבון
//                 </Title>
//                 <Text type="secondary" style={{ fontSize: isMobile ? 14 : 16 }}>
//                   רישום ותצוגת תנועות פיננסיות בעסק
//                 </Text>
//               </div>
//             </Space>
//           </Col>
//         </Row>
//       </Card>

//       {/* Summary Cards */}
//       <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
//         <Col xs={24} sm={8}>
//           <Card style={{ borderRadius: 12, textAlign: "center" }}>
//             <Statistic
//               title="סה״כ חובה"
//               value={totals.debit}
//               precision={2}
//               valueStyle={{ color: "#52c41a", fontSize: isMobile ? 20 : 24 }}
//               prefix="₪"
//               suffix=""
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={8}>
//           <Card style={{ borderRadius: 12, textAlign: "center" }}>
//             <Statistic
//               title="סה״כ זכות"
//               value={totals.credit}
//               precision={2}
//               valueStyle={{ color: "#ff4d4f", fontSize: isMobile ? 20 : 24 }}
//               prefix="₪"
//               suffix=""
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={8}>
//           <Card style={{ borderRadius: 12, textAlign: "center" }}>
//             <Statistic
//               title="יתרה"
//               value={totals.debit - totals.credit}
//               precision={2}
//               valueStyle={{
//                 color: totals.debit - totals.credit >= 0 ? "#52c41a" : "#ff4d4f",
//                 fontSize: isMobile ? 20 : 24,
//               }}
//               prefix="₪"
//               suffix=""
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Main Content */}
//       <Card style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
//         <Tabs activeKey={activeTab} onChange={setActiveTab} size={isMobile ? "small" : "middle"}>
//           <TabPane
//             tab={
//               <Space>
//                 <PlusOutlined />
//                 <span>הוספת תנועה</span>
//               </Space>
//             }
//             key="1"
//           >
//             <div style={{ maxWidth: 600, margin: "0 auto" }}>
//               {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
//               {success && <Alert message="התנועה נשמרה בהצלחה" type="success" style={{ marginBottom: 16 }} />}

//               <Form form={form} layout="vertical" onFinish={handleFinish} size={isMobile ? "middle" : "large"}>
//                 <Form.Item
//                   name="transactionType"
//                   label="סוג תנועה"
//                   rules={[{ required: true, message: "נא לבחור סוג תנועה" }]}
//                 >
//                   <Select placeholder="בחר סוג תנועה" showSearch optionFilterProp="children">
//                     {transactionTypes.map((type) => (
//                       <Option key={type.key} value={type.key}>
//                         <Space>
//                           <span style={{ color: type.color }}>{type.icon}</span>
//                           {type.label}
//                         </Space>
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   name="amount"
//                   label="סכום"
//                   rules={[
//                     { required: true, message: "נא להזין סכום" },
//                     {
//                       type: "number",
//                       min: 0.01,
//                       message: "הסכום חייב להיות גדול מאפס",
//                     },
//                   ]}
//                 >
//                   <InputNumber<number>
//                     placeholder="הזן סכום"
//                     style={{ width: "100%" }}
//                     min={0.01}
//                     formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
//                     parser={(value) => Number.parseFloat(value?.replace(/₪\s?|(,*)/g, "") || "0")}
//                     size={isMobile ? "middle" : "large"}
//                   />
//                 </Form.Item>

//                 <Form.Item name="description" label="תיאור (אופציונלי)">
//                   <Input.TextArea
//                     rows={3}
//                     placeholder="הוסף תיאור לתנועה..."
//                     showCount
//                     maxLength={200}
//                     size={isMobile ? "middle" : "large"}
//                   />
//                 </Form.Item>

//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   loading={loading}
//                   block
//                   size={isMobile ? "middle" : "large"}
//                   style={{
//                     height: isMobile ? 44 : 48,
//                     fontWeight: 600,
//                     borderRadius: 8,
//                   }}
//                 >
//                   <PlusOutlined />
//                   שמור תנועה
//                 </Button>
//               </Form>
//             </div>
//           </TabPane>

//           <TabPane
//             tab={
//               <Space>
//                 <FileTextOutlined />
//                 <span>צפייה בתנועות</span>
//               </Space>
//             }
//             key="2"
//           >
//             <div>
//               {/* Filters */}
//               <Card size="small" style={{ marginBottom: 16, borderRadius: 8 }}>
//                 <Row gutter={[16, 16]} align="middle">
//                   <Col xs={24} sm={12} md={8}>
//                     <RangePicker
//                       placeholder={["תאריך התחלה", "תאריך סיום"]}
//                       value={dateRange}
//                       onChange={(dates) => {
//                         if (dates) {
//                           const [start, end] = dates;
//                           setDateRange(start && end ? [start, end] : null);
//                         } else {
//                           setDateRange(null);
//                         }
//                       }}
//                       style={{ width: "100%" }}
//                       size={isMobile ? "middle" : "large"}
//                     />
//                   </Col>
//                   <Col xs={24} sm={12} md={6}>
//                     <Select
//                       placeholder="סנן לפי סוג"
//                       allowClear
//                       value={typeFilter}
//                       onChange={setTypeFilter}
//                       style={{ width: "100%" }}
//                       size={isMobile ? "middle" : "large"}
//                     >
//                       {transactionTypes.map((type) => (
//                         <Option key={type.key} value={type.key}>
//                           <Space>
//                             <span style={{ color: type.color }}>{type.icon}</span>
//                             {type.label}
//                           </Space>
//                         </Option>
//                       ))}
//                     </Select>
//                   </Col>
//                   <Col xs={24} sm={24} md={10}>
//                     <Space>
//                       <Button
//                         icon={<FilterOutlined />}
//                         onClick={() => {
//                           setDateRange(null)
//                           setTypeFilter(undefined)
//                         }}
//                       >
//                         נקה סינון
//                       </Button>
//                       <Text type="secondary">
//                         מציג {filteredTransactions.length} מתוך {transactions.length} תנועות
//                       </Text>
//                     </Space>
//                   </Col>
//                 </Row>
//               </Card>

//               {/* Transactions Display */}
//               {transactionsLoading ? (
//                 <div style={{ textAlign: "center", padding: "40px 0" }}>
//                   <Text>טוען תנועות...</Text>
//                 </div>
//               ) : transactions.length === 0 ? (
//                 <Empty description="לא נמצאו תנועות" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ padding: "40px 0" }}>
//                   <Button type="primary" onClick={() => setActiveTab("1")}>
//                     הוסף תנועה ראשונה
//                   </Button>
//                 </Empty>
//               ) : isMobile ? (
//                 // Mobile Card View
//                 <div>
//                   {filteredTransactions.map((transaction) => (
//                     <TransactionCard key={transaction.id} transaction={transaction} />
//                   ))}
//                 </div>
//               ) : (
//                 // Desktop Table View
//                 <Table
//                   columns={columns}
//                   dataSource={filteredTransactions}
//                   rowKey="id"
//                   pagination={{
//                     pageSize: 10,
//                     showSizeChanger: true,
//                     showQuickJumper: true,
//                     showTotal: (total, range) => `${range[0]}-${range[1]} מתוך ${total} תנועות`,
//                   }}
//                   scroll={{ x: 800 }}
//                   style={{ direction: "rtl" }}
//                 />
//               )}
//             </div>
//           </TabPane>
//         </Tabs>
//       </Card>
//     </div>
//   )
// }

// export default AccountTransactions



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
      const { data } = await axios.get(
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

    if (!values.amount || values.amount <= 0) {
      setError("נא להזין סכום תקין הגדול מאפס")
      setLoading(false)
      return
    }

    const invoiceToSend: Partial<InvoiceDto> = {
      id: 0,
      amount: values.amount,
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

    try {
      await axios.post(`${url}/api/Invoice`, invoiceToSend, {
        withCredentials: true,
      })
      setSuccess(true)
      form.resetFields()
      message.success("התנועה נוספה בהצלחה!")
      await fetchTotals()
      if (activeTab === "2") {
        await GetAllTransactions()
      }
    } catch (err) {
      setError("אירעה שגיאה בשמירת התנועה.")
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