import { useEffect, useState } from "react"
import { Button, List, Typography, message, Spin } from "antd"
import { DownloadOutlined, FileOutlined, CloudDownloadOutlined } from "@ant-design/icons"
import axios from "axios"
import { FileItem } from "../models/FileItem"

const { Text } = Typography

const BusinessFiles = () => {
    const [files, setFiles] = useState<FileItem[]>([])
    const [loading, setLoading] = useState(false)
    const url = import.meta.env.VITE_API_URL

    const fetchFiles = async () => {
        try {
            setLoading(true)
            const response = await axios.get<FileItem[]>(`${url}/FileUpload/my-files`, {
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
            const response = await axios.get(`${url}/FileUpload/my-files-download-zip`, {
                responseType: "blob",
                withCredentials: true,
            })

            const blob = new Blob([response.data], { type: "application/zip" })
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = "business-files.zip"
            link.click()
            URL.revokeObjectURL(link.href)
        } catch (err) {
            console.error(err)
            message.error("לא הצלחנו להוריד את כל הקבצים")
        }
    }

    const handleDownloadFile = async (file: FileItem) => {
        try {
            if (!file.id) {
                message.error("קובץ לא זמין להורדה");
                return;
            }
            const response = await axios.get(`${url}/FileUpload/download-file/${file.id}`, {
                responseType: "blob",
                withCredentials: true,
            });

            const fileName = file.fileName ?? "file";

            const blob = new Blob([response.data]);
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (err) {
            console.error(err);
            message.error("שגיאה בהורדת הקובץ");
        }
    };

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
                    renderItem={(file) => {
                        const displayName = file.fileName ?? file.invoicePath.split('/').pop() ?? "קובץ לא ידוע"
                        return (
                            <List.Item
                                actions={[
                                    <Button
                                        type="link"
                                        icon={<DownloadOutlined />}
                                        onClick={() => handleDownloadFile(file)}
                                        style={{ fontWeight: 600 }}
                                        key="download"
                                    >
                                        הורד
                                    </Button>,
                                ]}
                                key={file.id}
                            >
                                <FileOutlined style={{ marginLeft: 8 }} />
                                <Text>{displayName}</Text>
                            </List.Item>
                        )
                    }}
                />
            )}
        </div>
    )
}

export default BusinessFiles
