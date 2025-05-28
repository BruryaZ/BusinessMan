import { useEffect, useState } from "react"
import { Button, List, Typography, message, Spin } from "antd"
import { DownloadOutlined, FileOutlined, CloudDownloadOutlined } from "@ant-design/icons"
import axios from "axios"

const { Text } = Typography

const BusinessFiles = () => {
    const [files, setFiles] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const url = import.meta.env.VITE_API_URL


    const fetchFiles = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${url}/api/FileUpload/my-files`, {
                withCredentials: true,
            })
            setFiles(response.data)
        } catch (err) {
            message.error("אירעה שגיאה בעת טעינת הקבצים")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFiles()
    }, [])

    const handleDownloadZip = async () => {
        try {
            const response = await axios.get(`${url}/api/FileUpload/my-files-download-zip`, {
                responseType: "blob",
                withCredentials: true,
            })

            const blob = new Blob([response.data], { type: "application/zip" })
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = "business-files.zip"
            link.click()
            URL.revokeObjectURL(link.href)
        } catch {
            message.error("לא הצלחנו להוריד את כל הקבצים")
        }
    }

    const handleDownloadFile = async (fileName: string) => {
        try {
            const response = await axios.get(
                `${url}/api/FileUpload/download-file?fileName=${encodeURIComponent(fileName)}`,
                {
                    responseType: "blob",
                    withCredentials: true,
                }
            )

            const blob = new Blob([response.data])
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            URL.revokeObjectURL(link.href)
        } catch {
            message.error("שגיאה בהורדת הקובץ")
        }
    }

    return (
        <div dir="rtl" style={{ padding: "2rem", background: "var(--bg-color)", color: "var(--text-color)" }}>
            <h2 style={{ marginBottom: "1rem" }}>קבצי העסק שלי</h2>

            <Button
                type="default"
                icon={<CloudDownloadOutlined />}
                onClick={handleDownloadZip}
                style={{
                    marginBottom: "1rem",
                    fontWeight: 600,
                    borderWidth: 2,
                }}
            >
                הורד את כל הקבצים כ־ZIP
            </Button>

            {loading ? (
                <Spin tip="טוען קבצים..." />
            ) : (
                <List
                    bordered
                    dataSource={files}
                    locale={{ emptyText: "לא נמצאו קבצים" }}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    type="link"
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownloadFile(item)}
                                    style={{ fontWeight: 600 }}
                                >
                                    הורד
                                </Button>,
                            ]}
                        >
                            <FileOutlined style={{ marginLeft: 8 }} />
                            <Text>{item}</Text>
                        </List.Item>
                    )}
                />
            )}
        </div>
    )
}

export default BusinessFiles
