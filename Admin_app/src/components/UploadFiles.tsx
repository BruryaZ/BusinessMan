"use client"
import { useState } from "react"
import axios from "axios"
import {
  Upload,
  Button,
  Typography,
  Card,
  Alert,
  Progress,
  ConfigProvider,
  Space,
  Avatar,
  Divider,
  Row,
  Col,
  Modal,
  Descriptions,
  Tag,
  Spin,
  Steps,
  Result,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  App,
} from "antd"
import {
  CloudUploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
  FileOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  RocketOutlined,
  FileTextOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons"
import type { UploadProps } from "antd"
import dayjs from "dayjs"

const { Title, Text } = Typography
const { Dragger } = Upload
const { Step } = Steps
const { Option } = Select

// Types for Invoice data - מותאם למבנה השרת האמיתי
interface ServerInvoiceData {
  id: number
  amount: number
  amountDebit: number
  amountCredit: number
  invoiceDate: string
  status: number
  notes: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  invoicePath: string | null
  userId: number | null
  businessId: number | null
  business: null
  user: null
  type: string // זה string בתשובה השרת! (למשל "Income")
}

interface InvoiceData {
  id?: number
  invoiceNumber?: string
  supplierName?: string
  totalAmount?: number
  taxAmount?: number
  invoiceDate?: string
  dueDate?: string
  description?: string
  items?: InvoiceItem[]
  type?: number
}

interface InvoiceItem {
  description?: string
  quantity?: number
  unitPrice?: number
  total?: number
}

interface UploadResponse {
  message: string
  fileUrl: string
  fileName: string
  fileSize: number
  analyzedInvoice?: ServerInvoiceData // מותאם למבנה השרת
}

const UploadFiles = () => {
  const { message } = App.useApp()
  const [file, setFile] = useState<File | null>(null)
  const [messageText, setMessageText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  // Invoice confirmation states
  const [currentStep, setCurrentStep] = useState(0)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [editedInvoiceData, setEditedInvoiceData] = useState<InvoiceData | null>(null)
  const [fileUrl, setFileUrl] = useState<string>("")
  const [confirmingInvoice, setConfirmingInvoice] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const url = import.meta.env.VITE_API_URL

  const uploadProps: UploadProps = {
    name: "fileUpload",
    multiple: false,
    accept: ".jpg,.png,.pdf,.docx,.txt,.xlsx",
    beforeUpload: (file) => {
      setFile(file)
      setMessageText(null)
      setError(null)
      setUploadComplete(false)
      setShowInvoiceModal(false)
      setInvoiceData(null)
      setCurrentStep(0)
      return false
    },
    onRemove: () => {
      resetState()
    },
    onDrop: () => setDragActive(false),
  }

  const resetState = () => {
    setFile(null)
    setMessageText(null)
    setError(null)
    setUploadComplete(false)
    setProgress(0)
    setShowInvoiceModal(false)
    setInvoiceData(null)
    setEditedInvoiceData(null)
    setCurrentStep(0)
    setIsEditing(false)
    setFileUrl("")
  }

  const handleSubmit = async (analyzeAndSave: boolean = false) => {
    if (!file) {
      setError("יש לבחור קובץ לפני השליחה")
      return
    }

    setUploading(true)
    setProgress(0)
    setCurrentStep(1)

    const formData = new FormData()
    formData.append("fileUpload", file)

    try {
      // Simulate realistic progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const target = analyzeAndSave ? 70 : 90
          if (prev >= target) {
            clearInterval(progressInterval)
            return target
          }
          return prev + Math.random() * 15
        })
      }, 200)

      if (analyzeAndSave) {
        setAnalyzing(true)
        setCurrentStep(2)
      }

      const response = await axios.post(
        `${url}/FileUpload/upload?analyzeOnly=${analyzeAndSave}`, 
        formData, 
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      )

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        const data = response.data as UploadResponse
        
        console.log("תשובת השרת המלאה:", data) // לבדיקה
        console.log("האם analyzeAndSave:", analyzeAndSave) // לבדיקה
        
        if (analyzeAndSave) {
          if (data.analyzedInvoice) {
            // השרת מחזיר analyzedInvoice
            const invoiceFromServer = data.analyzedInvoice
            
            console.log("נתוני החשבונית מהשרת:", invoiceFromServer)
            console.log("סכום חובה:", invoiceFromServer.amountDebit)
            console.log("הערות:", invoiceFromServer.notes)
            
            // המרת הנתונים מהשרת לפורמט הקליינט
            const clientInvoiceData: InvoiceData = {
              invoiceNumber: extractInvoiceNumber(invoiceFromServer) || "לא זוהה",
              supplierName: extractSupplierName(invoiceFromServer) || "לא זוהה", 
              totalAmount: invoiceFromServer.amountDebit || invoiceFromServer.amount || 100,
              taxAmount: calculateTax(invoiceFromServer.amountDebit || invoiceFromServer.amount || 100),
              invoiceDate: invoiceFromServer.invoiceDate ? 
                new Date(invoiceFromServer.invoiceDate).toISOString().split('T')[0] : 
                new Date().toISOString().split('T')[0],
              dueDate: calculateDueDate(invoiceFromServer.invoiceDate),
              description: invoiceFromServer.notes || "נותח ע״י AI",
              type: getInvoiceTypeNumber(invoiceFromServer.type) || 2, // ברירת מחדל: הוצאה
              items: []
            }
            
            console.log("נתוני החשבונית לקליינט:", clientInvoiceData)
            
            setInvoiceData(clientInvoiceData)
            setEditedInvoiceData({ ...clientInvoiceData })
            setFileUrl(data.fileUrl)
            setShowInvoiceModal(true)
            setCurrentStep(3)
            setMessageText("הקובץ נותח בהצלחה! בדוק ואשר את פרטי החשבונית")
          } else {
            console.log("לא נמצאו נתוני חשבונית בתשובת השרת")
            console.log("מבנה התשובה:", Object.keys(data))
            setError("לא ניתן לנתח את הקובץ כחשבונית")
            setCurrentStep(0)
          }
        } else {
          setMessageText(data.message || "הקובץ הועלה בהצלחה")
          setUploadComplete(true)
          setCurrentStep(4)
        }
        
        setError(null)
        setUploading(false)
        setAnalyzing(false)
      }, 800)
    } catch (error: any) {
      console.error("Error uploading file:", error)
      console.log("פרטי השגיאה:", error.response?.data)
    
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        "שגיאה בהעלאת הקובץ"

      setError(Array.isArray(serverMessage) ? serverMessage[0] : serverMessage)
      setProgress(0)
      setUploading(false)
      setAnalyzing(false)
      setMessageText(null)
      setCurrentStep(0)
    }
  }

  const handleConfirmInvoice = async () => {
    if (!editedInvoiceData || !fileUrl || !file) return

    setConfirmingInvoice(true)

    try {
      // יצירת אובייקט חשבונית במבנה הנכון לשרת (לפי מודל Invoice)
      const serverInvoiceData = {
        Id: 0, // יווצר בשרת
        Amount: Number(editedInvoiceData.totalAmount) || 100,
        AmountDebit: Number(editedInvoiceData.totalAmount) || 100,
        AmountCredit: Number(editedInvoiceData.totalAmount) || 100,
        InvoiceDate: editedInvoiceData.invoiceDate ? 
          new Date(editedInvoiceData.invoiceDate + 'T00:00:00.000Z').toISOString() : 
          new Date().toISOString(),
        Status: 1,
        Notes: `מס' חשבונית: ${editedInvoiceData.invoiceNumber || "לא זוהה"}, ספק: ${editedInvoiceData.supplierName || "לא זוהה"}, ${editedInvoiceData.description || "נותח ע״י GPT"}`,
        CreatedAt: new Date().toISOString(),
        CreatedBy: "gpt",
        UpdatedAt: new Date().toISOString(),
        UpdatedBy: "gpt",
        InvoicePath: fileUrl, // השדה החסר שגרם לשגיאה!
        UserId: null,
        BusinessId: null,
        Business: null,
        User: null,
        Type: getInvoiceTypeString(editedInvoiceData.type || 1) // המרה חזרה ל-string
      }

      const confirmRequest = {
        Invoice: serverInvoiceData,
        FileUrl: fileUrl,          
        FileName: file.name,       
        FileSize: file.size        
      }

      console.log("נתוני החשבונית שנבנו:", JSON.stringify(serverInvoiceData, null, 2))
      console.log("בקשת אישור מלאה:", JSON.stringify(confirmRequest, null, 2))

      // ניסיון ראשון עם credentials
      let response
      try {
        response = await axios.post(
          `${url}/FileUpload/confirm-and-save`, 
          confirmRequest,
          {
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            withCredentials: true,
            timeout: 30000 // 30 שניות timeout
          }
        )
      } catch (corsError: any) {
        console.log("שגיאה עם credentials, מנסה בלי:", corsError.message)
        
        // ניסיון שני בלי credentials
        response = await axios.post(
          `${url}/FileUpload/confirm-and-save`, 
          confirmRequest,
          {
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            withCredentials: false,
            timeout: 30000
          }
        )
      }

      console.log("תשובת השרת:", response.data)
      
      setShowInvoiceModal(false)
      setUploadComplete(true)
      setCurrentStep(4)
      setMessageText("החשבונית והקובץ נשמרו בהצלחה במערכת")
      
    } catch (error: any) {
      console.error("Error confirming invoice:", error)
      
      if (error.code === 'ERR_NETWORK') {
        console.log("בעיית רשת או CORS")
        setError("שגיאת רשת - לא ניתן להתחבר לשרת. בדוק את הגדרות CORS בשרת.")
      } else if (error.code === 'ECONNABORTED') {
        setError("הבקשה לקחה יותר מדי זמן - נסה שוב")
      } else {
        console.log("פרטי השגיאה מפורטים:", JSON.stringify(error.response?.data, null, 2))
        console.log("status code:", error.response?.status)
        console.log("status text:", error.response?.statusText)
        
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || "שגיאה באישור החשבונית"
        setError(errorMessage)
      }
    } finally {
      setConfirmingInvoice(false)
    }
  }

  const handleCancelInvoice = () => {
    setShowInvoiceModal(false)
    setInvoiceData(null)
    setEditedInvoiceData(null)
    setFileUrl("")
    setMessageText("הקובץ הועלה אך החשבונית לא נשמרה")
    setUploadComplete(true)
    setCurrentStep(4)
  }

  const handleEditField = (field: string, value: any) => {
    if (editedInvoiceData) {
      setEditedInvoiceData({
        ...editedInvoiceData,
        [field]: value
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return <FileOutlined style={{ color: "#ff4d4f" }} />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileOutlined style={{ color: "#52c41a" }} />
      case "docx":
      case "doc":
        return <FileOutlined style={{ color: "#1890ff" }} />
      default:
        return <FileOutlined style={{ color: "#666" }} />
    }
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return "לא זוהה"
    return new Intl.NumberFormat('he-IL', { 
      style: 'currency', 
      currency: 'ILS' 
    }).format(amount)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "לא זוהה"
    try {
      return dayjs(dateStr).format('DD/MM/YYYY')
    } catch {
      return dateStr
    }
  }

  // פונקציות עזר לחילוץ נתונים מתשובת השרת
  const extractInvoiceNumber = (invoice: ServerInvoiceData) => {
    // ניסיון לחלץ מספר חשבונית מהערות
    if (invoice.notes) {
      const patterns = [
        /מס['׳]?\s*חשבונית\s*:?\s*([^\s,]+)/,
        /חשבונית\s*(?:מס|מספר)?\.?\s*:?\s*([A-Za-z0-9\-\/]+)/,
        /Invoice\s*(?:No|Number)?\.?\s*:?\s*([A-Za-z0-9\-\/]+)/
      ]
      
      for (const pattern of patterns) {
        const match = invoice.notes.match(pattern)
        if (match && match[1]) {
          return match[1].trim()
        }
      }
    }
    return "לא זוהה"
  }

  const extractSupplierName = (invoice: ServerInvoiceData) => {
    // ניסיון לחלץ שם ספק מהערות
    if (invoice.notes) {
      const patterns = [
        /ספק\s*:?\s*([^,\n]+)/,
        /([\u0590-\u05FF\s]+(?:בע״מ|בעמ|בע\"מ|ltd|LTD))/,
        /חברה\s*:?\s*([^,\n]+)/
      ]
      
      for (const pattern of patterns) {
        const match = invoice.notes.match(pattern)
        if (match && match[1]) {
          return match[1].trim()
        }
      }
    }
    return "לא זוהה"
  }

  const getInvoiceTypeNumber = (typeString: string) => {
    const typeMap: { [key: string]: number } = {
      "Income": 0,
      "Expense": 1,
      "AssetIncrease": 2,
      "AssetDecrease": 3,
      "LiabilityIncrease": 4,
      "LiabilityDecrease": 5,
      "EquityIncrease": 6,
      "EquityDecrease": 7
    }
    return typeMap[typeString] || 1 // ברירת מחדל: Expense
  }

  const getInvoiceTypeString = (typeNumber: number) => {
    const typeMap: { [key: number]: string } = {
      0: "Income",
      1: "Expense", 
      2: "AssetIncrease",
      3: "AssetDecrease",
      4: "LiabilityIncrease",
      5: "LiabilityDecrease",
      6: "EquityIncrease",
      7: "EquityDecrease"
    }
    return typeMap[typeNumber] || "Expense"
  }

  const calculateTax = (amount: number) => {
    return Math.round(amount * 0.17 * 100) / 100 // 17% מע״מ
  }

  const calculateDueDate = (invoiceDate?: string) => {
    if (!invoiceDate) return dayjs().add(30, 'day').format('YYYY-MM-DD')
    return dayjs(invoiceDate).add(30, 'day').format('YYYY-MM-DD')
  }

  const getInvoiceTypeText = (type?: number) => {
    const types = {
      0: "הכנסה",
      1: "הוצאה",
      2: "הגדלת נכס",
      3: "הקטנת נכס",
      4: "הגדלת התחייבות",
      5: "הקטנת התחייבות",
      6: "הגדלת הון",
      7: "הקטנת הון"
    }
    return types[type as keyof typeof types] || "הוצאה"
  }

  const steps = [
    {
      title: 'בחירת קובץ',
      description: 'בחר קובץ להעלאה',
      icon: <InboxOutlined />
    },
    {
      title: 'העלאה',
      description: 'מעלה קובץ לשרת',
      icon: <CloudUploadOutlined />
    },
    {
      title: 'ניתוח',
      description: 'מנתח תוכן עם AI',
      icon: <FileTextOutlined />
    },
    {
      title: 'אישור נתונים',
      description: 'בדוק ואשר פרטים',
      icon: <CheckCircleOutlined />
    },
    {
      title: 'הושלם',
      description: 'התהליך הושלם בהצלחה',
      icon: <RocketOutlined />
    }
  ]

  return (
    <ConfigProvider direction="rtl">
      <App>
        <div className="upload-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        <Card className="form-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Avatar
              size={80}
              className="upload-avatar"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                marginBottom: 16,
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
              }}
            >
              <RocketOutlined style={{ fontSize: 40 }} />
            </Avatar>

            <Title level={2} style={{ marginBottom: 8, color: "#2d3748", textAlign: "center" }}>
              העלאת קבצים וניתוח נתונים לעסק עם AI
            </Title>

            <Text type="secondary" style={{ fontSize: 16 }}>
              גרור קבצים או לחץ לבחירה - תמיכה מלאה בכל סוגי הקבצים
            </Text>

            <Divider />

            {/* Progress Steps */}
            <Steps 
              current={currentStep} 
              size="small" 
              style={{ marginBottom: 24, maxWidth: 800, margin: "0 auto 24px auto" }}
            >
              {steps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  icon={currentStep === index && (uploading || analyzing) ? <Spin size="small" /> : step.icon}
                  status={
                    currentStep > index ? 'finish' : 
                    currentStep === index ? (error ? 'error' : 'process') : 
                    'wait'
                  }
                />
              ))}
            </Steps>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={uploadComplete ? 24 : 16}>
              <Dragger
                {...uploadProps}
                className={`upload-dragger ${dragActive ? "drag-active" : ""}`}
                style={{
                  background: dragActive
                    ? "linear-gradient(145deg, #f0f7ff, #e6f4ff)"
                    : "linear-gradient(145deg, #f8fafc, #ffffff)",
                  border: dragActive ? "3px dashed #1890ff" : "2px dashed #667eea",
                  borderRadius: 20,
                  padding: "60px 20px",
                  marginBottom: 24,
                  position: "relative",
                  overflow: "hidden",
                }}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
              >
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined
                      style={{
                        fontSize: 80,
                        color: dragActive ? "#1890ff" : "#667eea",
                      }}
                    />
                  </p>
                  <Title
                    level={3}
                    style={{
                      color: "#2d3748",
                      marginBottom: 12,
                    }}
                  >
                    {dragActive ? "שחרר כאן!" : "גרור קובץ לכאן או לחץ לבחירה"}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 16, display: "block", marginBottom: 16 }}>
                    תומך בקבצים מסוג JPG, PNG, PDF, DOCX, TXT, XLSX
                  </Text>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    גודל מקסימלי: 10MB
                  </Text>
                </div>
              </Dragger>

              {file && !uploadComplete && (
                <Card
                  size="small"
                  style={{
                    marginBottom: 24,
                    background: uploading || analyzing
                      ? "linear-gradient(145deg, #f0f9ff, #ffffff)"
                      : "linear-gradient(145deg, #f0f9ff, #ffffff)",
                    border: "1px solid #e6f4ff",
                    borderRadius: 12,
                  }}
                >
                  <Row align="middle" gutter={[16, 16]}>
                    <Col flex="auto">
                      <Space>
                        {getFileIcon(file.name)}
                        <div>
                          <Text strong>{file.name}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {formatFileSize(file.size)}
                          </Text>
                        </div>
                      </Space>
                    </Col>
                    {!uploading && !analyzing && (
                      <Col>
                        <Space>
                          <Button type="text" icon={<EyeOutlined />} size="small" style={{ color: "#1890ff" }}>
                            תצוגה מקדימה
                          </Button>
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            onClick={resetState}
                          >
                            הסר
                          </Button>
                        </Space>
                      </Col>
                    )}
                  </Row>
                  
                  {/* Progress Bar during upload/analysis */}
                  {(uploading || analyzing) && (
                    <div style={{ marginTop: 16, textAlign: "center" }}>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                          {analyzing ? (
                            <>
                              <Spin size="small" />
                              <Text strong style={{ fontSize: 16 }}>מנתח קובץ עם AI...</Text>
                            </>
                          ) : (
                            <>
                              <CloudUploadOutlined style={{ color: "#1890ff", fontSize: 20 }} />
                              <Text strong style={{ fontSize: 16 }}>מעלה קובץ...</Text>
                            </>
                          )}
                        </div>
                        <Progress
                          percent={Math.round(progress)}
                          strokeColor={{
                            "0%": "#667eea",
                            "50%": "#764ba2",
                            "100%": "#52c41a",
                          }}
                          strokeWidth={8}
                          style={{ maxWidth: 300, margin: "0 auto" }}
                        />
                        <Text type="secondary" style={{ fontSize: 14 }}>
                          {analyzing && "מנתח תוכן הקובץ באמצעות AI..."}
                          {!analyzing && progress < 30 && "מתחיל העלאה..."}
                          {!analyzing && progress >= 30 && progress < 60 && "מעלה נתונים..."}
                          {!analyzing && progress >= 60 && progress < 90 && "מעבד קובץ..."}
                          {!analyzing && progress >= 90 && "משלים העלאה..."}
                        </Text>
                      </Space>
                    </div>
                  )}
                </Card>
              )}
            </Col>

            <Col xs={24} lg={uploadComplete ? 0 : 8} style={{ display: uploadComplete ? 'none' : 'block' }}>
              <Card title="פעולות מהירות" size="small" style={{ marginBottom: 24 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    size="large"
                    disabled={!file || uploading || analyzing}
                    loading={uploading}
                    icon={uploadComplete ? <CheckCircleOutlined /> : <CloudUploadOutlined />}
                    onClick={() => handleSubmit(false)}
                    block
                    style={{
                      height: 48,
                      fontWeight: 600,
                      fontSize: 16,
                      background: uploadComplete ? "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)" : undefined,
                    }}
                  >
                    {uploading ? "מעלה..." : uploadComplete ? "הועלה בהצלחה!" : "העלה קובץ בלבד"}
                  </Button>

                  <Button
                    type="default"
                    size="large"
                    disabled={!file || uploading || analyzing}
                    loading={analyzing}
                    icon={<FileTextOutlined />}
                    onClick={() => handleSubmit(true)}
                    block
                    style={{
                      height: 48,
                      fontWeight: 600,
                      fontSize: 16,
                      borderWidth: 2,
                      borderColor: "#722ed1",
                      color: "#722ed1",
                    }}
                  >
                    {analyzing ? "מנתח..." : "העלה + נתח עם AI"}
                  </Button>

                  {uploadComplete && (
                    <Button
                      type="default"
                      size="large"
                      icon={<DownloadOutlined />}
                      block
                      style={{
                        height: 40,
                        fontWeight: 600,
                        borderWidth: 2,
                      }}
                    >
                      הורד קובץ
                    </Button>
                  )}
                </Space>
              </Card>

              <Card title="מידע שימושי" size="small">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text strong style={{ color: "#52c41a" }}>✓</Text>
                    <Text style={{ marginRight: 8 }}>העלאה מאובטחת</Text>
                  </div>
                  <div>
                    <Text strong style={{ color: "#52c41a" }}>✓</Text>
                    <Text style={{ marginRight: 8 }}>ניתוח נתונים לעסק עם AI</Text>
                  </div>
                  <div>
                    <Text strong style={{ color: "#52c41a" }}>✓</Text>
                    <Text style={{ marginRight: 8 }}>זיהוי אוטומטי של חשבוניות</Text>
                  </div>
                  <div>
                    <Text strong style={{ color: "#52c41a" }}>✓</Text>
                    <Text style={{ marginRight: 8 }}>גיבוי אוטומטי</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Single unified message display */}
          {(messageText || error) && (
            <div style={{ marginTop: 24 }}>
              <Alert
                message={error ? "שגיאה!" : "הצלחה!"}
                description={
                  <div style={{ textAlign: "center", padding: "8px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
                      {error ? (
                        <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: 24 }} />
                      ) : (
                        <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />
                      )}
                      <Text strong style={{ fontSize: 16 }}>
                        {error || messageText}
                      </Text>
                    </div>
                    {!error && (
                      <Text type="secondary" style={{ fontSize: 14 }}>
                        הקובץ נשמר בבטחה במערכת ומוכן לניתוח
                      </Text>
                    )}
                  </div>
                }
                type={error ? "error" : "success"}
                showIcon={false}
                style={{
                  borderRadius: 16,
                  border: error ? "2px solid #ffccc7" : "2px solid #b7eb8f",
                  background: error 
                    ? "linear-gradient(145deg, #fff2f0, #ffffff)"
                    : "linear-gradient(145deg, #f6ffed, #ffffff)",
                  boxShadow: error 
                    ? "0 4px 12px rgba(255, 77, 79, 0.15)"
                    : "0 4px 12px rgba(82, 196, 26, 0.15)",
                }}
                action={
                  <div style={{ display: "flex", gap: 8 }}>
                    {error ? (
                      <Button 
                        size="small" 
                        danger 
                        ghost 
                        onClick={() => setError(null)}
                      >
                        נסה שוב
                      </Button>
                    ) : (
                      <>
                        <Button 
                          size="small" 
                          type="primary" 
                          ghost
                          onClick={() => setMessageText(null)}
                        >
                          סגור
                        </Button>
                        <Button 
                          size="small" 
                          type="default"
                        >
                          צפה בקובץ
                        </Button>
                      </>
                    )}
                  </div>
                }
              />
            </div>
          )}

          {/* Enhanced Invoice Confirmation Modal */}
          <Modal
            title={
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <Avatar
                  size={64}
                  style={{
                    background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
                    marginBottom: 16,
                  }}
                >
                  <FileTextOutlined style={{ fontSize: 32 }} />
                </Avatar>
                <Title level={3} style={{ margin: 0, color: "#2d3748" }}>
                  {isEditing ? "עריכת פרטי החשבונית" : "אישור פרטי החשבונית"}
                </Title>
                <Text type="secondary">
                  {isEditing ? "ערוך את הפרטים הנדרשים" : "בדוק את הפרטים שזוהו על ידי ה-AI ואשר לשמירה"}
                </Text>
              </div>
            }
            open={showInvoiceModal}
            onCancel={handleCancelInvoice}
            width={800}
            centered
            footer={[
              <Button 
                key="cancel" 
                onClick={handleCancelInvoice}
                size="large"
                style={{ marginLeft: 8 }}
              >
                ביטול - שמור קובץ בלבד
              </Button>,
              isEditing ? (
                <Button
                  key="save-edit"
                  type="primary"
                  onClick={() => setIsEditing(false)}
                  size="large"
                  icon={<SaveOutlined />}
                >
                  שמור שינויים
                </Button>
              ) : (
                <>
                  <Button
                    key="edit"
                    onClick={() => setIsEditing(true)}
                    size="large"
                    icon={<EditOutlined />}
                    style={{ marginLeft: 8 }}
                  >
                    ערוך פרטים
                  </Button>
                  <Button
                    key="confirm"
                    type="primary"
                    onClick={handleConfirmInvoice}
                    loading={confirmingInvoice}
                    size="large"
                    style={{
                      background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                      border: "none",
                      fontWeight: 600,
                    }}
                  >
                    {confirmingInvoice ? "שומר..." : "אשר ושמור חשבונית"}
                  </Button>
                </>
              )
            ]}
          >
            {editedInvoiceData && (
              <div style={{ padding: "16px 0" }}>
                {isEditing ? (
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="מספר חשבונית">
                          <Input
                            value={editedInvoiceData.invoiceNumber}
                            onChange={(e) => handleEditField('invoiceNumber', e.target.value)}
                            placeholder="הכנס מספר חשבונית"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="שם הספק">
                          <Input
                            value={editedInvoiceData.supplierName}
                            onChange={(e) => handleEditField('supplierName', e.target.value)}
                            placeholder="הכנס שם ספק"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="סכום כולל">
                          <InputNumber
                            value={editedInvoiceData.totalAmount}
                            onChange={(value) => handleEditField('totalAmount', value)}
                            style={{ width: '100%' }}
                            formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/₪\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="מע״מ">
                          <InputNumber
                            value={editedInvoiceData.taxAmount}
                            onChange={(value) => handleEditField('taxAmount', value)}
                            style={{ width: '100%' }}
                            formatter={(value) => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value!.replace(/₪\s?|(,*)/g, '')}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="תאריך חשבונית">
                          <DatePicker
                            value={editedInvoiceData.invoiceDate ? dayjs(editedInvoiceData.invoiceDate) : null}
                            onChange={(date) => handleEditField('invoiceDate', date?.format('YYYY-MM-DD'))}
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="תאריך פירעון">
                          <DatePicker
                            value={editedInvoiceData.dueDate ? dayjs(editedInvoiceData.dueDate) : null}
                            onChange={(date) => handleEditField('dueDate', date?.format('YYYY-MM-DD'))}
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label="תיאור">
                      <Input.TextArea
                        value={editedInvoiceData.description}
                        onChange={(e) => handleEditField('description', e.target.value)}
                        rows={3}
                        placeholder="הכנס תיאור החשבונית"
                      />
                    </Form.Item>

                    <Form.Item label="סוג חשבונית">
                      <Select
                        value={editedInvoiceData.type || 1}
                        onChange={(value) => handleEditField('type', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value={0}>הכנסה</Option>
                        <Option value={1}>הוצאה</Option>
                        <Option value={2}>הגדלת נכס</Option>
                        <Option value={3}>הקטנת נכס</Option>
                        <Option value={4}>הגדלת התחייבות</Option>
                        <Option value={5}>הקטנת התחייבות</Option>
                        <Option value={6}>הגדלת הון</Option>
                        <Option value={7}>הקטנת הון</Option>
                      </Select>
                    </Form.Item>
                  </Form>
                ) : (
                  <Descriptions 
                    bordered 
                    column={1}
                    size="small"
                    style={{ marginBottom: 24 }}
                  >
                    <Descriptions.Item 
                      label={
                        <Space>
                          <FileTextOutlined />
                          מספר חשבונית
                        </Space>
                      }
                    >
                      <Tag color="blue" style={{ fontSize: 14, padding: "4px 8px" }}>
                        {editedInvoiceData.invoiceNumber || "לא זוהה"}
                      </Tag>
                    </Descriptions.Item>
                    
                    <Descriptions.Item 
                      label={
                        <Space>
                          <UserOutlined />
                          ספק
                        </Space>
                      }
                    >
                      <Text strong>{editedInvoiceData.supplierName || "לא זוהה"}</Text>
                    </Descriptions.Item>
                    
                    <Descriptions.Item 
                      label={
                        <Space>
                          <DollarOutlined />
                          סכום כולל
                        </Space>
                      }
                    >
                      <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                        {formatCurrency(editedInvoiceData.totalAmount)}
                      </Text>
                    </Descriptions.Item>
                    
                    <Descriptions.Item 
                      label={
                        <Space>
                          <DollarOutlined />
                          מע"מ
                        </Space>
                      }
                    >
                      <Text>{formatCurrency(editedInvoiceData.taxAmount)}</Text>
                    </Descriptions.Item>
                    
                    <Descriptions.Item 
                      label={
                        <Space>
                          <CalendarOutlined />
                          תאריך חשבונית
                        </Space>
                      }
                    >
                      <Text>{formatDate(editedInvoiceData.invoiceDate)}</Text>
                    </Descriptions.Item>
                    
                    <Descriptions.Item 
                      label={
                        <Space>
                          <CalendarOutlined />
                          תאריך פירעון
                        </Space>
                      }
                    >
                      <Text>{formatDate(editedInvoiceData.dueDate)}</Text>
                    </Descriptions.Item>

                    {editedInvoiceData.description && (
                      <Descriptions.Item 
                        label="תיאור"
                      >
                        <Text>{editedInvoiceData.description}</Text>
                      </Descriptions.Item>
                    )}

                    <Descriptions.Item 
                      label="סוג חשבונית"
                    >
                      <Tag color={editedInvoiceData.type === 0 ? "green" : "orange"}>
                        {getInvoiceTypeText(editedInvoiceData.type)}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                )}

                {editedInvoiceData.items && editedInvoiceData.items.length > 0 && !isEditing && (
                  <div>
                    <Title level={5} style={{ marginBottom: 16 }}>
                      פירוט פריטים:
                    </Title>
                    <div style={{ 
                      maxHeight: 200, 
                      overflowY: "auto", 
                      border: "1px solid #d9d9d9", 
                      borderRadius: 8,
                      padding: 16
                    }}>
                      {editedInvoiceData.items.map((item, index) => (
                        <Card 
                          key={index} 
                          size="small" 
                          style={{ marginBottom: 8 }}
                        >
                          <Row gutter={[16, 8]}>
                            <Col span={12}>
                              <Text strong>{item.description || `פריט ${index + 1}`}</Text>
                            </Col>
                            <Col span={4}>
                              <Text type="secondary">כמות: {item.quantity || 1}</Text>
                            </Col>
                            <Col span={8}>
                              <Text>{formatCurrency(item.total)}</Text>
                            </Col>
                          </Row>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <Alert
                  message={isEditing ? "עריכת נתונים" : "שים לב"}
                  description={
                    isEditing 
                      ? "ערוך את הפרטים הנדרשים ולחץ 'שמור שינויים' כדי לעדכן את הנתונים."
                      : "הנתונים זוהו אוטומטיות על ידי AI. אנא בדוק את הדיוק לפני האישור."
                  }
                  type={isEditing ? "warning" : "info"}
                  showIcon
                  style={{ marginTop: 16 }}
                />
              </div>
            )}
          </Modal>

          {/* Success Result */}
          {uploadComplete && (
            <div style={{ marginTop: 24 }}>
              <Result
                status="success"
                title="התהליך הושלם בהצלחה!"
                subTitle={
                  invoiceData 
                    ? "הקובץ הועלה, נותח והחשבונית נשמרה במערכת."
                    : "הקובץ הועלה בהצלחה למערכת."
                }
                extra={[
                  <Button 
                    type="primary" 
                    key="new"
                    onClick={resetState}
                    icon={<CloudUploadOutlined />}
                  >
                    העלה קובץ נוסף
                  </Button>,
                  <Button 
                    key="view"
                    icon={<EyeOutlined />}
                  >
                    צפה בקבצים שלי
                  </Button>,
                  file && (
                    <Button 
                      key="download"
                      icon={<DownloadOutlined />}
                    >
                      הורד קובץ
                    </Button>
                  )
                ]}
              />
            </div>
          )}
        </Card>
      </div>
      </App>
    </ConfigProvider>
  )
}

export default UploadFiles