import type React from "react"
import type { Business } from "../models/Business"
import { Table, Typography, Card, ConfigProvider, Tag } from "antd"
import type { ColumnsType } from "antd/es/table"

const { Title } = Typography

interface BusinessTableProps {
  business: Business
}

const BusinessTable: React.FC<BusinessTableProps> = ({ business }) => {
  const dataSource = [business]

  const columns: ColumnsType<Business> = [
    {
      title: "מזהה",
      dataIndex: "id",
      key: "id",
      align: "right",
    },
    {
      title: "שם עסק",
      dataIndex: "name",
      key: "name",
      align: "right",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "כתובת",
      dataIndex: "address",
      key: "address",
      align: "right",
    },
    {
      title: "אימייל",
      dataIndex: "email",
      key: "email",
      align: "right",
    },
    {
      title: "סוג עסק",
      dataIndex: "businessType",
      key: "businessType",
      align: "right",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "הכנסות",
      dataIndex: "income",
      key: "income",
      align: "right",
      render: (value) => <span style={{ color: "#52c41a", fontWeight: "bold" }}>₪{value?.toLocaleString()}</span>,
    },
    {
      title: "הוצאות",
      dataIndex: "expenses",
      key: "expenses",
      align: "right",
      render: (value) => <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>₪{value?.toLocaleString()}</span>,
    },
    {
      title: "תזרים מזומנים",
      dataIndex: "cashFlow",
      key: "cashFlow",
      align: "right",
      render: (value) => <span style={{ color: "#1890ff", fontWeight: "bold" }}>₪{value?.toLocaleString()}</span>,
    },
    {
      title: "שווי נקי",
      dataIndex: "netWorth",
      key: "netWorth",
      align: "right",
      render: (value) => <span style={{ color: "#722ed1", fontWeight: "bold" }}>₪{value?.toLocaleString()}</span>,
    },
  ]

  return (
    <ConfigProvider direction="rtl">
      <div style={{ width: "100%" }}>
        <Title level={4} style={{ marginBottom: 16, textAlign: "right" }}>
          פרטי העסק
        </Title>

        <Card style={{ borderRadius: 12, overflow: "hidden" }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowKey="id"
            scroll={{ x: 800 }}
            style={{ direction: "rtl" }}
          />
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default BusinessTable
