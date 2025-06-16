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
        setMessage(response.data.message || "הקובץ הועלה בהצלחה")
        setError(null)
        setUploading(false)
        setUploadComplete(true)
      }, 800)
    } catch (err: any) {
      setProgress(0)
      setUploading(false)
      const msg = err.response?.data || "אירעה שגיאה בהעלאת הקובץ"
      setError(msg.message || msg)
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
      {/* Floating Upload Status Overlay */}
      {uploading && file && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid #d9d9d9",
            borderRadius: "12px",
            padding: "16px 24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            minWidth: "300px",
            maxWidth: "500px",
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Space>
                {getFileIcon(file.name)}
                <Text strong>{file.name}</Text>
              </Space>
              <Text style={{ color: "#fa8c16", fontWeight: "bold" }}>{Math.round(progress)}%</Text>
            </div>
            <Progress
              percent={progress}
              strokeColor={{
                "0%": "#667eea",
                "50%": "#764ba2",
                "100%": "#52c41a",
              }}
              strokeWidth={6}
              showInfo={false}
            />
            <Text type="secondary" style={{ fontSize: 12, textAlign: "center" }}>
              {progress < 30 && "מתחיל העלאה..."}
              {progress >= 30 && progress < 60 && "מעלה נתונים..."}
              {progress >= 60 && progress < 90 && "מעבד קובץ..."}
              {progress >= 90 && "משלים העלאה..."}
            </Text>
          </Space>
        </div>
      )}

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
            <Col xs={24} lg={16}>
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

              {file && !uploading && (
                <Card
                  size="small"
                  style={{
                    marginBottom: 24,
                    background: "linear-gradient(145deg, #f0f9ff, #ffffff)",
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
                  </Row>
                </Card>
              )}
            </Col>

            <Col xs={24} lg={8}>
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

          {message && (
            <Alert
              message="הצלחה!"
              description={
                <Space direction="vertical">
                  <Text>{message}</Text>
                  <Text type="secondary">הקובץ נשמר בבטחה במערכת</Text>
                </Space>
              }
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              style={{
                borderRadius: 12,
                border: "1px solid #b7eb8f",
                background: "linear-gradient(145deg, #f6ffed, #ffffff)",
              }}
              action={
                <Button size="small" type="primary" ghost>
                  צפה בקובץ
                </Button>
              }
            />
          )}

          {error && (
            <Alert
              message="שגיאה!"
              description={error}
              type="error"
              showIcon
              icon={<ExclamationCircleOutlined />}
              style={{
                borderRadius: 12,
                border: "1px solid #ffccc7",
                background: "linear-gradient(145deg, #fff2f0, #ffffff)",
              }}
              action={
                <Button size="small" danger ghost>
                  נסה שוב
                </Button>
              }
            />
          )}
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default UploadFiles
