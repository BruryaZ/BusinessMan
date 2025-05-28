"use client"

import type React from "react"
import { useContext, useEffect, useState } from "react"
import {
  Typography,
  Card,
  ConfigProvider,
  Button,
  Table,
  Tag,
  Space,
  Avatar,
  Divider,
  Row,
  Col,
  Modal,
  message,
  Popconfirm,
} from "antd"
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
  CrownOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import type { ColumnsType } from "antd/es/table"
import { globalContext } from "../context/GlobalContext"

const { Title, Text } = Typography
const url = import.meta.env.VITE_API_URL

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  idNumber: string
  role: number
  status: string
  lastLogin: Date
  createdAt: Date
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const globalContextDetails = useContext(globalContext)

  const nav = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get<User[]>(`${url}/api/User/users-by-business/${globalContextDetails.business_global.id}`, { withCredentials: true })
      setUsers(data)
    } catch (err) {
      console.error("שגיאה בטעינת משתמשים:", err)
      message.error("שגיאה בטעינת רשימת המשתמשים")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`${url}/api/User/${id}`, { withCredentials: true })
      if (res.status >= 200 && res.status < 300) {
        setUsers((prev) => prev.filter((user) => user.id !== id))
        message.success("המשתמש נמחק בהצלחה")
      }
    } catch (err) {
      console.error("שגיאה במחיקה:", err)
      message.error("שגיאה במחיקת המשתמש")
    }
  }

  const handleEdit = (id: number) => {
    nav(`/edit-user/${id}`)
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setModalVisible(true)
  }

  const columns: ColumnsType<User> = [
    {
      title: "מזהה",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
    },
    {
      title: "שם מלא",
      key: "fullName",
      render: (_, record) => (
        <Space>
          <Avatar
            size={32}
            style={{
              background: record.role === 1 ? "#722ed1" : "#1890ff",
            }}
          >
            {record.role === 1 ? <CrownOutlined /> : <UserOutlined />}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {record.firstName} {record.lastName}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ת.ז: {record.idNumber}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "פרטי קשר",
      key: "contact",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space size="small">
            <MailOutlined style={{ color: "#1890ff" }} />
            <Text>{record.email}</Text>
          </Space>
          <Space size="small">
            <PhoneOutlined style={{ color: "#52c41a" }} />
            <Text>{record.phone}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: "תפקיד",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role: number) => (
        <Tag color={role === 1 ? "purple" : "blue"} icon={role === 1 ? <CrownOutlined /> : <UserOutlined />}>
          {role === 1 ? "מנהל" : "משתמש רגיל"}
        </Tag>
      ),
    },
    {
      title: "סטטוס",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => (
        <Tag color={status === "active" ? "success" : "default"}>{status === "active" ? "פעיל" : "לא פעיל"}</Tag>
      ),
    },
    {
      title: "כניסה אחרונה",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (date: Date) => <Text type="secondary">{new Date(date).toLocaleDateString("he-IL")}</Text>,
    },
    {
      title: "פעולות",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => handleViewDetails(record)}
            style={{ color: "#1890ff" }}
          >
            צפה
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            style={{ color: "#fa8c16" }}
          >
            ערוך
          </Button>
          <Popconfirm
            title="מחיקת משתמש"
            description="האם אתה בטוח שברצונך למחוק את המשתמש?"
            onConfirm={() => handleDelete(record.id)}
            okText="כן"
            cancelText="לא"
          >
            <Button type="text" icon={<DeleteOutlined />} danger>
              מחק
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <ConfigProvider direction="rtl">
      <div style={{ marginTop: "50vh" }}></div>

      <div style={{ padding: "40px 20px", maxWidth: 1400, margin: "0 auto" }}>
        <Card className="form-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Avatar
              size={80}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                marginBottom: 16,
                boxShadow: "0 4px 14px rgba(102, 126, 234, 0.3)",
              }}
            >
              <TeamOutlined style={{ fontSize: 40 }} />
            </Avatar>

            <Title level={2} style={{ marginBottom: 8, color: "#2d3748", textAlign: "center" }}>
              ניהול משתמשים
            </Title>

            <Text type="secondary" style={{ fontSize: 16 }}>
              צפה, הוסף, ערוך או מחק משתמשים במערכת
            </Text>

            <Divider />
          </div>

          <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col>
              <Space>
                <Text strong style={{ fontSize: 16 }}>
                  סה״כ משתמשים: {users.length}
                </Text>
                <Tag color="blue">מנהלים: {users.filter((u) => u.role === 1).length}</Tag>
                <Tag color="green">משתמשים: {users.filter((u) => u.role === 2).length}</Tag>
                <Tag color="orange">מנהלי חשבונות: {users.filter((u) => u.role === 3).length}</Tag>
              </Space>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => nav("/register-user")}
                style={{
                  height: 48,
                  padding: "0 24px",
                  fontWeight: 600,
                }}
              >
                הוסף משתמש חדש
              </Button>
            </Col>
          </Row>

          <Card style={{ borderRadius: 12, overflow: "hidden" }}>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} מתוך ${total} משתמשים`,
              }}
              scroll={{ x: 800 }}
              style={{ direction: "rtl" }}
            />
          </Card>

          <Modal
            title={
              <Space>
                <UserOutlined />
                <span>פרטי משתמש</span>
              </Space>
            }
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setModalVisible(false)}>
                סגור
              </Button>,
              <Button
                key="edit"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  if (selectedUser) {
                    handleEdit(selectedUser.id)
                    setModalVisible(false)
                  }
                }}
              >
                ערוך משתמש
              </Button>,
            ]}
            width={600}
          >
            {selectedUser && (
              <div style={{ padding: "16px 0" }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                      <Avatar
                        size={64}
                        style={{
                          background: selectedUser.role === 1 ? "#722ed1" : "#1890ff",
                          marginBottom: 8,
                        }}
                      >
                        {selectedUser.role === 1 ? <CrownOutlined /> : <UserOutlined />}
                      </Avatar>
                      <div>
                        <Title level={4} style={{ margin: 0 }}>
                          {selectedUser.firstName} {selectedUser.lastName}
                        </Title>
                        <Tag color={selectedUser.role === 1 ? "purple" : "blue"} style={{ marginTop: 8 }}>
                          {selectedUser.role === 1 ? "מנהל" : "משתמש רגיל"}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <Text strong>אימייל:</Text>
                      <Text>{selectedUser.email}</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <Text strong>טלפון:</Text>
                      <Text>{selectedUser.phone}</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <Text strong>תעודת זהות:</Text>
                      <Text>{selectedUser.idNumber}</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <Text strong>סטטוס:</Text>
                      <Tag color={selectedUser.status === "active" ? "success" : "default"}>
                        {selectedUser.status === "active" ? "פעיל" : "לא פעיל"}
                      </Tag>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <Text strong>כניסה אחרונה:</Text>
                      <Text>{new Date(selectedUser.lastLogin).toLocaleDateString("he-IL")}</Text>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size="small">
                      <Text strong>תאריך הצטרפות:</Text>
                      <Text>{new Date(selectedUser.createdAt).toLocaleDateString("he-IL")}</Text>
                    </Space>
                  </Col>
                </Row>
              </div>
            )}
          </Modal>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default UserManagement
