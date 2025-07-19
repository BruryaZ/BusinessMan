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
  message as antMessage,
  Spin,
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
} from "@ant-design/icons"
import type { UploadProps } from "antd"

const { Title, Text } = Typography
const { Dragger } = Upload

// Types for Invoice data
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
  invoice?: InvoiceData
}

const UploadFiles = () => {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  // Invoice confirmation states
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [fileUrl, setFileUrl] = useState<string>("")
  const [confirmingInvoice, setConfirmingInvoice] = useState(false)

  const url = import.meta.env.VITE_API_URL

  const uploadProps: UploadProps = {
    name: "fileUpload",
    multiple: false,
    accept: ".jpg,.png,.pdf,.docx,.txt,.xlsx",
    beforeUpload: (file) => {
      setFile(file)
      setMessage(null)
      setError(null)
      setUploadComplete(false)
      setShowInvoiceModal(false)
      setInvoiceData(null)
      return false
    },
    onRemove: () => {
      setFile(null)
      setMessage(null)
      setError(null)
      setUploadComplete(false)
      setProgress(0)
      setShowInvoiceModal(false)
      setInvoiceData(null)
    },
    onDrop: () => setDragActive(false),
  }

  const handleSubmit = async (analyzeAndSave: boolean = false) => {
    if (!file) {
      setError("יש לבחור קובץ לפני השליחה")
      return
    }

    setUploading(true)
    setProgress(0)

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
      }

      const response = await axios.post(
        `${url}/FileUpload/upload?analyzeAndSave=${analyzeAndSave}`, 
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
        
        if (analyzeAndSave && data.invoice) {
          // Show invoice confirmation modal
          setInvoiceData(data.invoice)
          setFileUrl(data.fileUrl)
          setShowInvoiceModal(true)
          setMessage("הקובץ נותח בהצלחה! אשר את פרטי החשבונית")
        } else {
          setMessage(data.message || "הקובץ הועלה בהצלחה")
          setUploadComplete(true)
        }
        
        setError(null)
        setUploading(false)
        setAnalyzing(false)
      }, 800)
    } catch (error: any) {
      console.error("Error uploading file:", error)
    
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        "שגיאה בהעלאת הקובץ"

      setError(Array.isArray(serverMessage) ? serverMessage[0] : serverMessage)
      setProgress(0)
      setUploading(false)
      setAnalyzing(false)
      setMessage(null)
    }
  }

  const handleConfirmInvoice = async () => {
    if (!invoiceData || !fileUrl || !file) return

    setConfirmingInvoice(true)

    try {
      const confirmRequest = {
        invoice: invoiceData,
        fileUrl: fileUrl,
        fileName: file.name,
        fileSize: file.size
      }

      const response = await axios.post(
        `${url}/FileUpload/confirm-invoice`, 
        confirmRequest,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )

      antMessage.success("החשבונית והקובץ נשמרו בהצלחה!")
      setShowInvoiceModal(false)
      setUploadComplete(true)
      setMessage("החשבונית והקובץ נשמרו בהצלחה במערכת")
      
    } catch (error: any) {
      console.error("Error confirming invoice:", error)
      const errorMessage = error.response?.data?.message || "שגיאה באישור החשבונית"
      antMessage.error(errorMessage)
    } finally {
      setConfirmingInvoice(false)
    }
  }

  const handleCancelInvoice = () => {
    setShowInvoiceModal(false)
    setInvoiceData(null)
    setFileUrl("")
    setMessage("הקובץ הועלה אך החשבונית לא נשמרה")
    setUploadComplete(true)
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
      return new Date(dateStr).toLocaleDateString('he-IL')
    } catch {
      return dateStr
    }
  }

return (
    <ConfigProvider direction="rtl">
      <div className="upload-container" style={{ maxWidth: 900, margin: "0 auto"}}>
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
                            onClick={() => {
                              setFile(null)
                              setMessage(null)
                              setError(null)
                              setUploadComplete(false)
                              setInvoiceData(null)
                              setShowInvoiceModal(false)
                            }}
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
                    <Text strong style={{ color: "#52c41a" }}>
                      ✓
                    </Text>
                    <Text style={{ marginRight: 8 }}>העלאה מאובטחת</Text>
                  </div>
                  <div>
                    <Text strong style={{ color: "#52c41a" }}>
                      ✓
                    </Text>
                    <Text style={{ marginRight: 8 }}>ניתוח נתונים לעסק עם AI</Text>
                  </div>
                  <div>
                    <Text strong style={{ color: "#52c41a" }}>
                      ✓
                    </Text>
                    <Text style={{ marginRight: 8 }}>זיהוי אוטומטי של חשבוניות</Text>
                  </div>
                  <div>
                    <Text strong style={{ color: "#52c41a" }}>
                      ✓
                    </Text>
                    <Text style={{ marginRight: 8 }}>גיבוי אוטומטי</Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Single unified message display */}
          {(message || error) && (
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
                        {error || message}
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
                          onClick={() => setMessage(null)}
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

          {/* Invoice Confirmation Modal */}
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
                  אישור פרטי החשבונית
                </Title>
                <Text type="secondary">
                  בדוק את הפרטים שזוהו על ידי ה-AI ואשר לשמירה
                </Text>
              </div>
            }
            open={showInvoiceModal}
            onCancel={handleCancelInvoice}
            width={700}
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
            ]}
          >
            {invoiceData && (
              <div style={{ padding: "16px 0" }}>
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
                      {invoiceData.invoiceNumber || "לא זוהה"}
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
                    <Text strong>{invoiceData.supplierName || "לא זוהה"}</Text>
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
                      {formatCurrency(invoiceData.totalAmount)}
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
                    <Text>{formatCurrency(invoiceData.taxAmount)}</Text>
                  </Descriptions.Item>
                  
                  <Descriptions.Item 
                    label={
                      <Space>
                        <CalendarOutlined />
                        תאריך חשבונית
                      </Space>
                    }
                  >
                    <Text>{formatDate(invoiceData.invoiceDate)}</Text>
                  </Descriptions.Item>
                  
                  <Descriptions.Item 
                    label={
                      <Space>
                        <CalendarOutlined />
                        תאריך פירעון
                      </Space>
                    }
                  >
                    <Text>{formatDate(invoiceData.dueDate)}</Text>
                  </Descriptions.Item>
                </Descriptions>

                {invoiceData.items && invoiceData.items.length > 0 && (
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
                      {invoiceData.items.map((item, index) => (
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
                  message="שים לב"
                  description="הנתונים זוהו אוטומטיות על ידי AI. אנא בדוק את הדיוק לפני האישור."
                  type="info"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              </div>
            )}
          </Modal>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default UploadFiles