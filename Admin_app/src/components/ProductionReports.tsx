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
  Button,
} from "antd";
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
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { globalContext } from "../context/GlobalContext";
import type { ProdactionReportData, ProdactionReportMonthlyData } from "../models/ProdactionReportData";
import { TrendingDownOutlined, TrendingUpOutlined } from "@mui/icons-material";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProductionReports = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [reportData, setReportData] = useState<ProdactionReportData | null>(null);
  const [monthlyReportData, setMonthlyReportData] = useState<ProdactionReportMonthlyData | null>(null);
  const [loading, setLoading] = useState(true);
  const globalContextDetails = useContext(globalContext);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          `${url}/api/Reports/business-report/${globalContextDetails.business_global.id}`,
          { withCredentials: true }
        );
        setReportData(data);
      } catch (error) {
        console.error("שגיאה בטעינת דוח ייצור:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          `${url}/api/Reports/monthly?businessId=${globalContextDetails.business_global.id}&year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}`,
          { withCredentials: true }
        );
        setMonthlyReportData(data);
      } catch (error) {
        console.error("שגיאה בטעינת דוח:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const reportMetrics = reportData && monthlyReportData
    ? [
      {
        title: "סה״כ הכנסות",
        value: reportData.totalIncome,
        prefix: "₪",
        icon: <WarningOutlined />,
        color: "#52c41a",
        change: monthlyReportData.incomeChangePercent,
      },
      {
        title: "סה״כ הוצאות",
        value: reportData.totalExpenses,
        prefix: "₪",
        icon: <DingdingOutlined />,
        color: "#ff4d4f",
        change: monthlyReportData.expensesChangePercent,
      },
      {
        title: "רווח נקי",
        value: reportData.netProfit,
        prefix: "₪",
        icon: <DollarOutlined />,
        color: "#1890ff",
        change: monthlyReportData.netProfitChangePercent,
      },
      {
        title: "תזרים מזומנים",
        value: reportData.cashFlow,
        prefix: "₪",
        icon: <BarChartOutlined />,
        color: "#722ed1",
        change: 0, // אם יש לך ערך דינמי גם לזה, שים אותו כאן
      },
      {
        title: "מספר חשבוניות",
        value: reportData.invoiceCount,
        icon: <FileTextOutlined />,
        color: "#fa8c16",
        change: 0, // אם יש לך שינוי במספר חשבוניות מחודש קודם
      },
      {
        title: "סה״כ סכום חובה",
        value: reportData.totalDebit,
        prefix: "₪",
        icon: <TrendingDownOutlined />,
        color: "#f5222d",
        change: 0,
      },
      {
        title: "סה״כ סכום זכות",
        value: reportData.totalCredit,
        prefix: "₪",
        icon: <TrendingUpOutlined />,
        color: "#13c2c2",
        change: 0,
      },
      {
        title: "תאריך הדוח",
        value: new Date(reportData.reportDate).toLocaleDateString("he-IL"),
        icon: <CalendarOutlined />,
        color: "#666",
        change: 0,
      },
    ]
    : [];

  const handlePrint = () => {
    const printContent = document.getElementById("report-to-print")?.innerHTML;
    if (!printContent) return;

    const newWindow = window.open("", "_blank");
    newWindow?.document.write(`
        <html>
          <head>
            <title>דוח ייצור - ${reportData?.businessName ?? ""}</title>
            <style>
        body {
          direction: rtl;
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #1e1e1e;
          color: #ffffff;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background-color: #2c2c2c;
          color: #ffffff;
        }

        th, td {
          border: 1px solid #555;
          padding: 8px;
          text-align: right;
        }

        th {
          background-color: #333;
          color: #f0f0f0;
        }

        h1, h2, h3, h4 {
          color: #ffffff;
        }

        .section {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #2a2a2a;
          border-radius: 8px;
        }

        @media print {
          .business-metric {
            display: fles;
            flex-direction: row;
            align-items: center;
            max-height: 150px;
            padding: 4px;
            margin: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            font-family: "Assistant", "Rubik", "Heebo", sans-serif;
          }

          #report-to-print {
            page-break-inside: auto;
            break-inside: auto;
            color: black;
          }

          body {
            font-size: 12px;
            background-color: white !important;
            color: black !important;
          }

          .section {
            background-color: white !important;
          }

          table {
            background-color: white !important;
            color: black !important;
          }

          th {
            background-color: #eee !important;
            color: black !important;
          }
        }
      </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
    newWindow?.document.close();
    newWindow?.focus();
    newWindow?.print();
    newWindow?.close();
  };

  const handleDownload = () => {
    const input = document.getElementById("report-to-print");
    if (!input) return;
  
    // הוספת פילטר שמגדיל קונטרסט
    input.style.filter = "contrast(1.3) brightness(0.9)";
  
    setTimeout(() => {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`דוח_ייצור_${new Date().toLocaleDateString("he-IL")}.pdf`);
  
        // הסרת הפילטר אחרי הצילום
        input.style.filter = "";
      });
    }, 300);
  };
  
  return (
    <ConfigProvider direction="rtl">
      <div
        style={{
          padding: "40px 20px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
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

            <Title
              level={2}
              style={{ marginBottom: 8, color: "#2d3748", textAlign: "center" }}
            >
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
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="large"
                  onClick={handleDownload}
                >
                  הורד דוח
                </Button>
              </Col>
              <Col>
                <Button
                  type="default"
                  icon={<PrinterOutlined />}
                  size="large"
                  onClick={handlePrint}
                >
                  הדפס
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
              <div >
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
                    <div id="report-to-print">
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
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
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
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                    }}
                                  >
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
                  </Space>
                )}
              </div>
            </TabPane>

            {/* שאר הטאבס נשארים כפי שהם */}
            <TabPane
              tab={
                <span>
                  <LineChartOutlined />
                  מגמות
                </span>
              }
              key="2"
            >
              {/* תוכן הטאב */}
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
              {/* תוכן הטאב */}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default ProductionReports;