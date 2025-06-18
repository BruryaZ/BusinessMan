"use client"

import React, { useEffect, useState } from "react"
import {
  Button,
  List,
  Typography,
  message,
  Spin,
  Card,
  Space,
  Empty,
  Badge,
  Tooltip,
  Divider,
  Row,
  Col,
} from "antd"
import {
  DownloadOutlined,
  FileOutlined,
  CloudDownloadOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileZipOutlined,
} from "@ant-design/icons"
import axios from 'axios';
import { FileItem } from "../models/FileItem"

const { Text, Title } = Typography

const BusinessFiles: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [downloadingZip, setDownloadingZip] = useState(false)
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null)
  const url = import.meta.env.VITE_API_URL

  const extractServerMessage = (err: any, fallback: string) => {
    return err?.response?.data?.message || err?.message || fallback;
  };  

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const response = await axios.get<FileItem[]>(`${url}/FileUpload/my-files`, {
        withCredentials: true,
      })
      setFiles(response.data)
    } catch (err) {
      message.error(extractServerMessage(err, "אירעה שגיאה בעת טעינת הקבצים"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#1890ff' }} />
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageOutlined style={{ color: '#722ed1' }} />
      case 'zip':
      case 'rar':
        return <FileZipOutlined style={{ color: '#fa8c16' }} />
      case 'txt':
        return <FileTextOutlined style={{ color: '#13c2c2' }} />
      default:
        return <FileOutlined style={{ color: '#8c8c8c' }} />
    }
  }

  const handleDownloadZip = async () => {
    setDownloadingZip(true)
    try {
      const response = await axios.get(`${url}/FileUpload/my-files-download-zip`, {
        responseType: "blob",
        withCredentials: true,
      })

      const blob = new Blob([response.data as BlobPart], { type: "application/zip" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = "business-files.zip"
      link.click()
      URL.revokeObjectURL(link.href)
      message.success("הקבצים הורדו בהצלחה!")
    } catch (err) {
      message.error(extractServerMessage(err, "לא הצלחנו להוריד את כל הקבצים"))
    } finally {
      setDownloadingZip(false)
    }
  }

  const handleDownloadFile = async (file: FileItem) => {
    if (!file.id) {
      message.error("קובץ לא זמין להורדה")
      return
    }

    setDownloadingFileId(file.id.toString())
    try {
      const response = await axios.get(`${url}/FileUpload/download-file/${file.id}`, {
        responseType: "blob",
        withCredentials: true,
      })

      const fileName = file.fileName ?? "file"
      const blob = new Blob([response.data as BlobPart])
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      URL.revokeObjectURL(link.href)
      message.success(`הקובץ "${fileName}" הורד בהצלחה!`)
    } catch (err) {
      message.error(extractServerMessage(err, "שגיאה בהורדת הקובץ"))
    } finally {
      setDownloadingFileId(null)
    }
  }

    return (
        <div dir="rtl" style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
            <Card
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
            >
                <div style={{ marginBottom: 24 }}>
                    <Space align="center" style={{ marginBottom: 16 }}>
                        <FolderOpenOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                        <Title level={2} style={{ margin: 0, color: "#262626" }}>
                            קבצי העסק שלי
                        </Title>
                    </Space>

                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Card size="small" style={{ textAlign: "center", backgroundColor: "#f0f9ff" }}>
                                <Badge count={files.length} showZero color="#1890ff">
                                    <FileOutlined style={{ fontSize: 20 }} />
                                </Badge>
                                <div style={{ marginTop: 8 }}>
                                    <Text strong>סה"כ קבצים</Text>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>

                <Divider />

                <div style={{ marginBottom: 24 }}>
                    <Space wrap>
                        <Button
                            type="primary"
                            size="large"
                            icon={<CloudDownloadOutlined />}
                            onClick={handleDownloadZip}
                            loading={downloadingZip}
                            disabled={files.length === 0}
                            style={{
                                borderRadius: 8,
                                fontWeight: 600,
                                height: 48
                            }}
                        >
                            {downloadingZip ? "מוריד קבצים..." : "הורד את כל הקבצים כ־ZIP"}
                        </Button>

                        <Tooltip title="רענן רשימת קבצים">
                            <Button
                                icon={<FolderOpenOutlined />}
                                onClick={fetchFiles}
                                loading={loading}
                                style={{ borderRadius: 8, height: 48 }}
                            >
                                רענן
                            </Button>
                        </Tooltip>
                    </Space>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <Spin size="large" tip="טוען קבצים..." />
                    </div>
                ) : files.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div>
                                <Text type="secondary" style={{ fontSize: 16 }}>
                                    לא נמצאו קבצים
                                </Text>
                                <br />
                                <Text type="secondary">
                                    העלה קבצים כדי לראות אותם כאן
                                </Text>
                            </div>
                        }
                        style={{ padding: "60px 0" }}
                    />
                ) : (
                    <>

                        <List
                            bordered={false}
                            dataSource={files}
                            renderItem={(file) => {
                                const displayName = file.fileName ?? file.invoicePath?.split('/').pop() ?? "קובץ לא ידוע"
                                const isDownloading = downloadingFileId === file.id?.toString()

                                return (
                                    <List.Item
                                        style={{
                                            padding: "16px 20px",
                                            marginBottom: 8,
                                            backgroundColor: "#fafafa",
                                            borderRadius: 8,
                                            border: "1px solid #f0f0f0",
                                            transition: "all 0.3s ease"
                                        }}
                                        className="file-item"
                                        actions={[
                                            <Button
                                                type="primary"
                                                icon={<DownloadOutlined />}
                                                onClick={() => handleDownloadFile(file)}
                                                loading={isDownloading}
                                                style={{
                                                    borderRadius: 6,
                                                    fontWeight: 600
                                                }}
                                                key="download"
                                            >
                                                {isDownloading ? "מוריד..." : "הורד"}
                                            </Button>,
                                        ]}
                                        key={file.id}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <div style={{ fontSize: 24 }}>
                                                    {getFileIcon(displayName)}
                                                </div>
                                            }
                                            title={
                                                <Text strong style={{ fontSize: 16 }}>
                                                    {displayName}
                                                </Text>
                                            }

                                        />
                                    </List.Item>
                                )
                            }}
                        />
                    </>
                )}
            </Card>

            <style>{`
                .file-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    background-color: #ffffff !important;
                }
            `}</style>
        </div>
    )
}

export default BusinessFiles