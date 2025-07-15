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
} from "@ant-design/icons"
import type { UploadProps } from "antd"

const { Title, Text } = Typography
const { Dragger } = Upload

const UploadFiles = () => {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const url = import.meta.env.VITE_API_URL

  const uploadProps: UploadProps = {
    name: "fileUpload",
    multiple: false,
    accept: ".jpg,.png,.pdf,.docx,.txt",
    beforeUpload: (file) => {
      setFile(file)
      setMessage(null)
      setError(null)
      setUploadComplete(false)
      return false // Prevent automatic upload
    },
    onRemove: () => {
      setFile(null)
      setMessage(null)
      setError(null)
      setUploadComplete(false)
      setProgress(0)
    },
    onDrop: () => setDragActive(false),
  }

  const handleSubmit = async () => {
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
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 200)

      const response = await axios.post(`${url}/FileUpload/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        const data = response.data as { message?: string }
        setMessage(data.message || "הקובץ הועלה בהצלחה")
        setError(null)
        setUploading(false)
        setUploadComplete(true)
      }, 800)
    } catch (error: any) {
      console.error("Error fetching business data:", error);
    
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "שגיאה בטעינת נתוני העסק";
    
      setError(serverMessage[0]);
      setProgress(0)
      setUploading(false)
      setMessage(null)
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
                    תומך בקבצים מסוג JPG, PNG, PDF, DOCX, TXT
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
                    background: uploading 
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
                    {!uploading && (
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
                            }}
                          >
                            הסר
                          </Button>
                        </Space>
                      </Col>
                    )}
                  </Row>
                  
                  {/* Progress Bar during upload */}
                  {uploading && (
                    <div style={{ marginTop: 16, textAlign: "center" }}>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                          <CloudUploadOutlined style={{ color: "#1890ff", fontSize: 20 }} />
                          <Text strong style={{ fontSize: 16 }}>מעלה קובץ...</Text>
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
                          {progress < 30 && "מתחיל העלאה..."}
                          {progress >= 30 && progress < 60 && "מעלה נתונים..."}
                          {progress >= 60 && progress < 90 && "מעבד קובץ..."}
                          {progress >= 90 && "משלים העלאה..."}
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
                    disabled={!file || uploading}
                    loading={uploading}
                    icon={uploadComplete ? <CheckCircleOutlined /> : <CloudUploadOutlined />}
                    onClick={handleSubmit}
                    block
                    style={{
                      height: 48,
                      fontWeight: 600,
                      fontSize: 16,
                      background: uploadComplete ? "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)" : undefined,
                    }}
                  >
                    {uploading ? "מעלה..." : uploadComplete ? "הועלה בהצלחה!" : "העלה קובץ"}
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
                    <Text style={{ marginRight: 8 }}>עדכון נתונים</Text>
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
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default UploadFiles