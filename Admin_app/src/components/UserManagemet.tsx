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
  Row,
  Col,
  Modal,
  message,
  Popconfirm,
  Drawer,
  Statistic,
  Tooltip,
  Input,
  Select,
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
  DollarOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import type { ColumnsType } from "antd/es/table"
import { globalContext } from "../context/GlobalContext"
import type { User } from "../models/User"

const { Title, Text } = Typography
const { Search } = Input
const { Option } = Select
const url = import.meta.env.VITE_API_URL

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [isMobile, setIsMobile] = useState(false)

  const globalContextDetails = useContext(globalContext)
  const nav = useNavigate()

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchText, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get<User[]>(
        `${url}/api/User/users-by-business/${globalContextDetails.business_global.id}`,
        { withCredentials: true },
      )
      setUsers(data)
    } catch (err) {
      console.error("שגיאה בטעינת משתמשים:", err)
      message.error("שגיאה בטעינת רשימת המשתמשים")
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchText) {
      filtered = filtered.filter(
        (user) =>
          (user.firstName ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
          (user.lastName ?? "").toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase()) ||
          user.idNumber.includes(searchText),
      )
    }

    if (roleFilter !== undefined) {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`${url}/api/User/${id}`, { withCredentials: true })
      if (res.status >= 200 && res.status < 300) {
        globalContextDetails.setUserCount(globalContextDetails.usersCount - 1)
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
    if (isMobile) {
      setDrawerVisible(true)
    } else {
      setModalVisible(true)
    }
  }

  const getRoleInfo = (role: number) => {
    switch (role) {
      case 1:
        return { color: "purple", icon: <CrownOutlined />, text: "מנהל", bg: "#722ed1" }
      case 3:
        return { color: "orange", icon: <DollarOutlined />, text: "מנהל חשבונות", bg: "#faad14" }
      default:
        return { color: "blue", icon: <UserOutlined />, text: "משתמש רגיל", bg: "#1890ff" }
    }
  }

  const UserCard: React.FC<{ user: User }> = ({ user }) => {
    const roleInfo = getRoleInfo(user.role)

    return (
      <Card
        hoverable
        style={{
          borderRadius: 16,
          marginBottom: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <Row align="middle" gutter={[16, 16]}>
          <Col flex="none">
            <Avatar size={48} style={{ background: roleInfo.bg }}>
              {roleInfo.icon}
            </Avatar>
          </Col>

          <Col flex="auto">
            <div>
              <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                {user.firstName} {user.lastName}
              </Title>
              <Space wrap size="small">
                <Tag color={roleInfo.color}>
                  {roleInfo.text}
                </Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ת.ז: {user.idNumber}
                </Text>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Space direction="vertical" size={2}>
                  <Space size="small">
                    <MailOutlined style={{ color: "#1890ff", fontSize: 12 }} />
                    <Text style={{ fontSize: 12 }}>{user.email}</Text>
                  </Space>
                  <Space size="small">
                    <PhoneOutlined style={{ color: "#52c41a", fontSize: 12 }} />
                    <Text style={{ fontSize: 12 }}>{user.phone}</Text>
                  </Space>
                </Space>
              </div>
            </div>
          </Col>

          <Col flex="none">
            <Space direction="vertical" size="small">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetails(user)}
                style={{ color: "#1890ff" }}
                size="small"
              >
                צפה
              </Button>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(user.id)}
                style={{ color: "#fa8c16" }}
                size="small"
              >
                ערוך
              </Button>
              <Popconfirm
                title="מחיקת משתמש"
                description="האם אתה בטוח שברצונך למחוק את המשתמש?"
                onConfirm={() => handleDelete(user.id)}
                okText="כן"
                cancelText="לא"
                placement="topRight"
              >
                <Button type="text" icon={<DeleteOutlined />} danger size="small">
                  מחק
                </Button>
              </Popconfirm>
            </Space>
          </Col>
        </Row>
      </Card>
    )
  }

  const columns: ColumnsType<User> = [
    {
      title: "משתמש",
      key: "user",
      render: (_, record) => {
        const roleInfo = getRoleInfo(record.role)
        return (
          <Space>
            <Avatar size={40} style={{ background: roleInfo.bg }}>
              {roleInfo.icon}
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
        )
      },
    },
    {
      title: "פרטי קשר",
      key: "contact",
      responsive: ["md"],
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
      render: (role: number) => {
        const roleInfo = getRoleInfo(role)
        return (
          <Tag color={roleInfo.color} icon={roleInfo.icon}>
            {roleInfo.text}
          </Tag>
        )
      },
    },
    {
      title: "סטטוס",
      dataIndex: "status",
      key: "status",
      align: "center",
      responsive: ["lg"],
      render: (status: string) => (
        <Tag color={status === "active" ? "success" : "default"}>{status === "active" ? "פעיל" : "לא פעיל"}</Tag>
      ),
    },
    {
      title: "כניסה אחרונה",
      dataIndex: "lastLogin",
      key: "lastLogin",
      responsive: ["xl"],
      render: (date: Date) => <Text type="secondary">{new Date(date).toLocaleDateString("he-IL")}</Text>,
    },
    {
      title: "פעולות",
      key: "actions",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="צפה בפרטים">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              style={{ color: "#1890ff" }}
              size="small"
            />
          </Tooltip>
          <Tooltip title="ערוך">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
              style={{ color: "#fa8c16" }}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="מחיקת משתמש"
            description="האם אתה בטוח שברצונך למחוק את המשתמש?"
            onConfirm={() => handleDelete(record.id)}
            okText="כן"
            cancelText="לא"
          >
            <Tooltip title="מחק">
              <Button type="text" icon={<DeleteOutlined />} danger size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const UserDetailsContent = () => (
    <div style={{ padding: isMobile ? "8px 0" : "16px 0" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Avatar
              size={isMobile ? 56 : 64}
              style={{
                background: selectedUser ? getRoleInfo(selectedUser.role).bg : "#1890ff",
                marginBottom: 8,
              }}
            >
              {selectedUser ? getRoleInfo(selectedUser.role).icon : <UserOutlined />}
            </Avatar>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {selectedUser?.firstName} {selectedUser?.lastName}
              </Title>
              <Tag color={selectedUser ? getRoleInfo(selectedUser.role).color : "blue"} style={{ marginTop: 8 }}>
                {selectedUser ? getRoleInfo(selectedUser.role).text : ""}
              </Tag>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>אימייל:</Text>
            <Text copyable>{selectedUser?.email}</Text>
          </Space>
        </Col>

        <Col xs={24} sm={12}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>טלפון:</Text>
            <Text copyable>{selectedUser?.phone}</Text>
          </Space>
        </Col>

        <Col xs={24} sm={12}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>תעודת זהות:</Text>
            <Text>{selectedUser?.idNumber}</Text>
          </Space>
        </Col>

        <Col xs={24} sm={12}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>סטטוס:</Text>
            <Tag color={selectedUser?.status === "active" ? "success" : "default"}>
              {selectedUser?.status === "active" ? "פעיל" : "לא פעיל"}
            </Tag>
          </Space>
        </Col>

        <Col xs={24} sm={12}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>כניסה אחרונה:</Text>
            <Text>
              {selectedUser?.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString("he-IL") : "לא ידוע"}
            </Text>
          </Space>
        </Col>

        <Col xs={24} sm={12}>
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text strong>תאריך הצטרפות:</Text>
            <Text>
              {selectedUser?.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString("he-IL") : "לא ידוע"}
            </Text>
          </Space>
        </Col>
      </Row>
    </div>
  )

  return (
    <ConfigProvider direction="rtl">
      <div
        style={{
          padding: isMobile ? "16px" : "40px 20px",
          maxWidth: 1400,
          margin: "0 auto",
          minHeight: "100vh",
          background: "#f5f5f5",
        }}
      >
        {/* Header Card */}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Row align="middle" gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Space direction={isMobile ? "vertical" : "horizontal"} size="middle">
                <Avatar
                  size={isMobile ? 56 : 64}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  <TeamOutlined style={{ fontSize: isMobile ? 28 : 32 }} />
                </Avatar>
                <div style={{ textAlign: isMobile ? "center" : "right" }}>
                  <Title level={isMobile ? 3 : 2} style={{ margin: 0, color: "#2d3748" }}>
                    ניהול משתמשים
                  </Title>
                  <Text type="secondary" style={{ fontSize: isMobile ? 14 : 16 }}>
                    צפה, הוסף, ערוך או מחק משתמשים במערכת
                  </Text>
                </div>
              </Space>
            </Col>

            <Col xs={24} md={8} style={{ textAlign: isMobile ? "center" : "left" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size={isMobile ? "middle" : "large"}
                onClick={() => nav("/register-user")}
                style={{
                  height: isMobile ? 40 : 48,
                  padding: isMobile ? "0 16px" : "0 24px",
                  fontWeight: 600,
                  borderRadius: 8,
                }}
                block={isMobile}
              >
                הוסף משתמש חדש
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 12, textAlign: "center" }}>
              <Statistic
                title="סה״כ משתמשים"
                value={users.length}
                valueStyle={{ color: "#1890ff", fontSize: isMobile ? 20 : 24 }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 12, textAlign: "center" }}>
              <Statistic
                title="מנהלים"
                value={users.filter((u) => u.role === 1).length}
                valueStyle={{ color: "#722ed1", fontSize: isMobile ? 20 : 24 }}
                prefix={<CrownOutlined />}
              />
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 12, textAlign: "center" }}>
              <Statistic
                title="משתמשים רגילים"
                value={users.filter((u) => u.role === 2).length}
                valueStyle={{ color: "#1890ff", fontSize: isMobile ? 20 : 24 }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>

          <Col xs={12} sm={6}>
            <Card style={{ borderRadius: 12, textAlign: "center" }}>
              <Statistic
                title="מנהלי חשבונות"
                value={users.filter((u) => u.role === 3).length}
                valueStyle={{ color: "#faad14", fontSize: isMobile ? 20 : 24 }}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="חפש לפי שם, אימייל או ת.ז"
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: "100%" }}
                prefix={<SearchOutlined />}
              />
            </Col>

            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="תפקיד"
                allowClear
                value={roleFilter}
                onChange={setRoleFilter}
                style={{ width: "100%" }}
              >
                <Option value={1}>מנהל</Option>
                <Option value={2}>משתמש רגיל</Option>
                <Option value={3}>מנהל חשבונות</Option>
              </Select>
            </Col>

            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="סטטוס"
                allowClear
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
              >
                <Option value="active">פעיל</Option>
                <Option value="inactive">לא פעיל</Option>
              </Select>
            </Col>

            <Col xs={24} md={8}>
              <Text type="secondary">
                מציג {filteredUsers.length} מתוך {users.length} משתמשים
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Users Display */}
        <Card style={{ borderRadius: 12, overflow: "hidden" }}>
          {isMobile ? (
            // Mobile Card View
            <div>
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Text>טוען משתמשים...</Text>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Text type="secondary">לא נמצאו משתמשים</Text>
                </div>
              ) : (
                filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
              )}
            </div>
          ) : (
            // Desktop Table View
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} מתוך ${total} משתמשים`,
                responsive: true,
              }}
              scroll={{ x: 800 }}
              style={{ direction: "rtl" }}
            />
          )}
        </Card>

        {/* Desktop Modal */}
        <Modal
          title={
            <Space>
              <UserOutlined />
              <span>פרטי משתמש</span>
            </Space>
          }
          open={modalVisible && !isMobile}
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
          <UserDetailsContent />
        </Modal>

        {/* Mobile Drawer */}
        <Drawer
          title={
            <Space>
              <UserOutlined />
              <span>פרטי משתמש</span>
            </Space>
          }
          placement="bottom"
          height="80%"
          open={drawerVisible && isMobile}
          onClose={() => setDrawerVisible(false)}
          extra={
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  if (selectedUser) {
                    handleEdit(selectedUser.id)
                    setDrawerVisible(false)
                  }
                }}
                size="small"
              >
                ערוך
              </Button>
            </Space>
          }
        >
          <UserDetailsContent />
        </Drawer>
      </div>
    </ConfigProvider>
  )
}

export default UserManagement
