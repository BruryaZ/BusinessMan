"use client"
import {
  Typography,
  Card,
  ConfigProvider,
  Tabs,
  Divider,
  Spin,
  Row,
  Col,
  Statistic,
  Avatar,
  Space,
  Tag,
  Progress,
  Button,
} from "antd"
import {
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FileTextOutlined,
  WarningOutlined,
  DingdingOutlined,
  DollarOutlined,
  CalendarOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ShareAltOutlined,
} from "@ant-design/icons"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { globalContext } from "../context/GlobalContext"
import type { ProdactionReportData } from "../models/ProdactionReportData"
import { TrendingDownOutlined, TrendingUpOutlined } from "@mui/icons-material"

const { Title, Text } = Typography
const { TabPane } = Tabs

const ProductionReports = () => {
  const [activeTab, setActiveTab] = useState("1")
  const [reportData, setReportData] = useState<ProdactionReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const globalContextDetails = useContext(globalContext)
  const url = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          `${url}/api/Reports/business-report/${globalContextDetails.business_global.id}`,
          { withCredentials: true },
        )
        setReportData(data)
      } catch (error) {
        console.error("שגיאה בטעינת דוח ייצור:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [])

  const reportMetrics = reportData
    ? [
        {
          title: "סה״כ הכנסות",
          value: reportData.totalIncome,
          prefix: "₪",
          icon: <WarningOutlined />,
          color: "#52c41a",
          change: 12.5,
        },
        {
          title: "סה״כ הוצאות",
          value: reportData.totalExpenses,
          prefix: "₪",
          icon: <DingdingOutlined />,
          color: "#ff4d4f",
          change: -3.2,
        },
        {
          title: "רווח נקי",
          value: reportData.netProfit,
          prefix: "₪",
          icon: <DollarOutlined />,
          color: "#1890ff",
          change: 8.7,
        },
        {
          title: "תזרים מזומנים",
          value: reportData.cashFlow,
          prefix: "₪",
          icon: <BarChartOutlined />,
          color: "#722ed1",
          change: 5.3,
        },
        {
          title: "מספר חשבוניות",
          value: reportData.invoiceCount,
          icon: <FileTextOutlined />,
          color: "#fa8c16",
          change: 15.4,
        },
        {
          title: "סה״כ חיובים",
          value: reportData.totalDebit,
          prefix: "₪",
          icon: <TrendingDownOutlined />,
          color: "#f5222d",
          change: -2.1,
        },
        {
          title: "סה״כ זיכויים",
          value: reportData.totalCredit,
          prefix: "₪",
          icon: <TrendingUpOutlined />,
          color: "#13c2c2",
          change: 18.3,
        },
        {
          title: "תאריך הדוח",
          value: new Date(reportData.reportDate).toLocaleDateString("he-IL"),
          icon: <CalendarOutlined />,
          color: "#666",
          change: 0,
        },
      ]
    : []

  return (
    <ConfigProvider direction="rtl">
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
              <FileTextOutlined style={{ fontSize: 40 }} />
            </Avatar>

            <Title level={2} style={{ marginBottom: 8, color: "#2d3748", textAlign: "center" }}>
              דוח ייצור - {reportData?.businessName ?? "טוען..."}
            </Title>

            <Text type="secondary" style={{ fontSize: 16 }}>
              צפה בביצועי הייצור והנתונים הפיננסיים של העסק שלך
            </Text>

            <Divider />
          </div>

          <div style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]} justify="end">
              <Col>
                <Button type="primary" icon={<DownloadOutlined />} size="large">
                  הורד דוח
                </Button>
              </Col>
              <Col>
                <Button type="default" icon={<PrinterOutlined />} size="large">
                  הדפס
                </Button>
              </Col>
              <Col>
                <Button type="default" icon={<ShareAltOutlined />} size="large">
                  שתף
                </Button>
              </Col>
            </Row>
          </div>

          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane
              tab={
                <span>
                  <BarChartOutlined />
                  סקירה כללית
                </span>
              }
              key="1"
            >
              {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 24 }}>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                      טוען נתוני הדוח...
                    </Text>
                  </div>
                </div>
              ) : (
                <Space direction="vertical" style={{ width: "100%" }} size="large">
                  <div>
                    <Title level={4} style={{ marginBottom: 16 }}>
                      מדדים פיננסיים עיקריים
                    </Title>
                    <Row gutter={[16, 16]}>
                      {reportMetrics.map((metric, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                          <Card
                            className="business-metric"
                            style={{
                              height: "100%",
                              background: `${metric.color}08`,
                              border: `1px solid ${metric.color}30`,
                              borderRadius: 16,
                            }}
                          >
                            <Space direction="vertical" style={{ width: "100%" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                  {metric.title}
                                </Text>
                                <Avatar
                                  size={40}
                                  style={{
                                    background: `${metric.color}20`,
                                    color: metric.color,
                                  }}
                                >
                                  {metric.icon}
                                </Avatar>
                              </div>

                              <Statistic
                                value={metric.value}
                                prefix={metric.prefix}
                                valueStyle={{
                                  color: metric.color,
                                  fontSize: "1.8rem",
                                  fontWeight: "bold",
                                }}
                              />

                              {metric.change !== 0 && (
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                  <Tag color={metric.change > 0 ? "success" : "error"}>
                                    {metric.change > 0 ? "+" : ""}
                                    {metric.change}%
                                  </Tag>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    מהחודש הקודם
                                  </Text>
                                </div>
                              )}
                            </Space>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <div>
                    <Title level={4} style={{ marginBottom: 16 }}>
                      מדדי ביצועים
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={8}>
                        <Card style={{ height: "100%", borderRadius: 16 }}>
                          <Space direction="vertical" style={{ width: "100%" }}>
                            <Text strong style={{ fontSize: 16 }}>
                              שיעור רווח
                            </Text>
                            <div style={{ textAlign: "center", margin: "16px 0" }}>
                              <Progress
                                type="circle"
                                percent={75}
                                format={() => (
                                  <div>
                                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#52c41a" }}>
                                      25.3%
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "#666" }}>יעד: 30%</div>
                                  </div>
                                )}
                                strokeColor="#52c41a"
                                size={120}
                              />
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <Tag color="success">קרוב ליעד</Tag>
                            </div>
                          </Space>
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card style={{ height: "100%", borderRadius: 16 }}>
                          <Space direction="vertical" style={{ width: "100%" }}>
                            <Text strong style={{ fontSize: 16 }}>
                              תשואה על השקעה
                            </Text>
                            <div style={{ textAlign: "center", margin: "16px 0" }}>
                              <Progress
                                type="circle"
                                percent={85}
                                format={() => (
                                  <div>
                                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1890ff" }}>
                                      18.7%
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "#666" }}>יעד: 15%</div>
                                  </div>
                                )}
                                strokeColor="#1890ff"
                                size={120}
                              />
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <Tag color="success">עומד ביעד</Tag>
                            </div>
                          </Space>
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card style={{ height: "100%", borderRadius: 16 }}>
                          <Space direction="vertical" style={{ width: "100%" }}>
                            <Text strong style={{ fontSize: 16 }}>
                              יחס חוב להון
                            </Text>
                            <div style={{ textAlign: "center", margin: "16px 0" }}>
                              <Progress
                                type="circle"
                                percent={60}
                                format={() => (
                                  <div>
                                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fa8c16" }}>
                                      35.2%
                                    </div>
                                    <div style={{ fontSize: "0.8rem", color: "#666" }}>יעד: 40%</div>
                                  </div>
                                )}
                                strokeColor="#fa8c16"
                                size={120}
                              />
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <Tag color="success">מצוין</Tag>
                            </div>
                          </Space>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Space>
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <LineChartOutlined />
                  מגמות
                </span>
              }
              key="2"
            >
              <div
                style={{
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f5f5f5",
                  borderRadius: 16,
                  border: "2px dashed #d9d9d9",
                }}
              >
                <Space direction="vertical" style={{ textAlign: "center" }}>
                  <LineChartOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
                  <Title level={4} style={{ color: "#999" }}>
                    כאן יוצגו נתוני המגמות
                  </Title>
                  <Text type="secondary">גרפים ותרשימים של מגמות העסק לאורך זמן</Text>
                </Space>
              </div>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <PieChartOutlined />
                  התפלגות
                </span>
              }
              key="3"
            >
              <div
                style={{
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f5f5f5",
                  borderRadius: 16,
                  border: "2px dashed #d9d9d9",
                }}
              >
                <Space direction="vertical" style={{ textAlign: "center" }}>
                  <PieChartOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
                  <Title level={4} style={{ color: "#999" }}>
                    כאן תוצג התפלגות הנתונים
                  </Title>
                  <Text type="secondary">תרשימי עוגה והתפלגות של נתוני העסק</Text>
                </Space>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default ProductionReports
