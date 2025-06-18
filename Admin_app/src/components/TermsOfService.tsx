"use client"

import type React from "react"
import { Typography, Card, ConfigProvider, Avatar, Row, Col, Steps, Alert, Tag } from "antd"
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SafetyOutlined,
  UserOutlined,
  CrownOutlined,
} from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography

const TermsOfService: React.FC = () => {
  const termsSteps = [
    {
      title: "הסכמה לתנאים",
      description: "על ידי שימוש במערכת, אתה מסכים לכל התנאים המפורטים כאן",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "שימוש אחראי",
      description: "השתמש במערכת באופן חוקי ואתי בלבד",
      icon: <SafetyOutlined />,
    },
    {
      title: "הגנה על מידע",
      description: "שמור על סודיות פרטי הגישה שלך ועל מידע רגיש",
      icon: <UserOutlined />,
    },
    {
      title: "עמידה בחוקים",
      description: "ציית לכל החוקים והתקנות הרלוונטיים",
      icon: <ExclamationCircleOutlined />,
    },
  ]

  const userObligations = [
    {
      title: "שמירה על פרטי גישה",
      description: "אתה אחראי לשמור על סודיות שם המשתמש והסיסמה שלך",
      severity: "high",
    },
    {
      title: "שימוש חוקי בלבד",
      description: "אסור להשתמש במערכת לפעילויות בלתי חוקיות או מזיקות",
      severity: "high",
    },
    {
      title: "דיווח על בעיות",
      description: "דווח על כל בעיה או תקלה שאתה מזהה במערכת",
      severity: "medium",
    },
    {
      title: "עדכון פרטים",
      description: "שמור על פרטיך עדכניים ומדויקים במערכת",
      severity: "medium",
    },
    {
      title: "גיבוי מידע",
      description: "מומלץ לבצע גיבויים קבועים למידע החשוב שלך",
      severity: "low",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "#ff4d4f"
      case "medium":
        return "#fa8c16"
      case "low":
        return "#52c41a"
      default:
        return "#1890ff"
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "high":
        return "חובה"
      case "medium":
        return "חשוב"
      case "low":
        return "מומלץ"
      default:
        return "רגיל"
    }
  }

  return (
    <ConfigProvider direction="rtl">
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Avatar
              size={80}
              style={{
                background: "linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)",
                marginBottom: 24,
              }}
            >
              <FileTextOutlined style={{ fontSize: 40 }} />
            </Avatar>
            <Title level={1} style={{ color: "#2d3748", marginBottom: 16 }}>
              תנאי שימוש
            </Title>
            <Paragraph
              style={{
                fontSize: 18,
                color: "#718096",
                maxWidth: 600,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              תנאי השימוש במערכת BusinessMan. אנא קרא בעיון לפני השימוש במערכת.
            </Paragraph>
          </div>

          {/* Last Updated */}
          <Alert
            message="עדכון אחרון: 15 בדצמבר 2024"
            description="תנאי השימוש עודכנו לאחרונה בתאריך זה. השינויים נכנסו לתוקף מיידית."
            type="warning"
            showIcon
            style={{ marginBottom: 40, borderRadius: 12 }}
          />

          {/* Introduction */}
          <Card
            style={{
              borderRadius: 20,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              border: "none",
              marginBottom: 40,
            }}
            styles={{ body:{ padding: "40px" }}}
          >
            <Title level={2} style={{ color: "#2d3748", marginBottom: 24 }}>
              מבוא
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.7, color: "#4a5568" }}>
              ברוכים הבאים למערכת BusinessMan לניהול עסקים. תנאי שימוש אלה מהווים הסכם משפטי בינך לבין החברה. השימוש
              במערכת מותנה בהסכמתך המלאה לתנאים אלה.
            </Paragraph>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.7, color: "#4a5568" }}>
              אם אינך מסכים לתנאים אלה, אנא הימנע משימוש במערכת. המשך השימוש במערכת מהווה הסכמה לתנאים אלה.
            </Paragraph>
          </Card>

          {/* Steps */}
          <Card
            style={{
              borderRadius: 20,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              border: "none",
              marginBottom: 40,
            }}
            styles={{ body:{ padding: "40px" }}}
          >
            <Title level={2} style={{ color: "#2d3748", marginBottom: 32 }}>
              עקרונות יסוד
            </Title>
            <Steps
              direction="vertical"
              current={-1}
              items={termsSteps.map((step) => ({
                title: step.title,
                description: step.description,
                icon: step.icon,
              }))}
            />
          </Card>

          {/* User Obligations */}
          <Card
            style={{
              borderRadius: 20,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              border: "none",
              marginBottom: 40,
            }}
            styles={{ body:{ padding: "40px" }}}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
              <Avatar
                size={48}
                style={{
                  background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
                  marginLeft: 16,
                }}
              >
                <CrownOutlined style={{ fontSize: 24 }} />
              </Avatar>
              <Title level={2} style={{ margin: 0, color: "#2d3748" }}>
                חובות המשתמש
              </Title>
            </div>

            <Row gutter={[24, 24]}>
              {userObligations.map((obligation, index) => (
                <Col xs={24} md={12} key={index}>
                  <Card
                    size="small"
                    style={{
                      height: "100%",
                      borderRadius: 12,
                      border: `2px solid ${getSeverityColor(obligation.severity)}20`,
                    }}
                    styles={{ body:{ padding: "20px" }}}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <Title level={5} style={{ margin: 0, color: "#2d3748", flex: 1 }}>
                        {obligation.title}
                      </Title>
                      <Tag color={getSeverityColor(obligation.severity)} style={{ marginRight: 8 }}>
                        {getSeverityText(obligation.severity)}
                      </Tag>
                    </div>
                    <Text style={{ color: "#4a5568", lineHeight: 1.6 }}>{obligation.description}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Service Availability */}
          <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
            <Col xs={24} md={12}>
              <Card
                style={{
                  height: "100%",
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "none",
                }}
                styles={{ body:{ padding: "24px" }}}
              >
                <Title level={4} style={{ color: "#2d3748", marginBottom: 16 }}>
                  זמינות השירות
                </Title>
                <ul style={{ paddingRight: 20, margin: 0 }}>
                  <li style={{ marginBottom: 8 }}>
                    <Text style={{ color: "#4a5568" }}>אנו שואפים לזמינות של 99.9% אך לא מתחייבים לכך</Text>
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    <Text style={{ color: "#4a5568" }}>תחזוקות מתוכננות יבוצעו בהודעה מוקדמת</Text>
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    <Text style={{ color: "#4a5568" }}>אנו לא אחראים להפסקות שירות בשל כוח עליון</Text>
                  </li>
                </ul>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                style={{
                  height: "100%",
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  border: "none",
                }}
                styles={{ body:{ padding: "24px" }}}
              >
                <Title level={4} style={{ color: "#2d3748", marginBottom: 16 }}>
                  הגבלת אחריות
                </Title>
                <ul style={{ paddingRight: 20, margin: 0 }}>
                  <li style={{ marginBottom: 8 }}>
                    <Text style={{ color: "#4a5568" }}>השימוש במערכת הוא על אחריותך הבלעדית</Text>
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    <Text style={{ color: "#4a5568" }}>אנו לא אחראים לנזקים עקיפים או תוצאתיים</Text>
                  </li>
                  <li style={{ marginBottom: 8 }}>
                    <Text style={{ color: "#4a5568" }}>מומלץ לבצע גיבויים קבועים למידע שלך</Text>
                  </li>
                </ul>
              </Card>
            </Col>
          </Row>

          {/* Contact Information */}
          <Card
            style={{
              borderRadius: 20,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              color: "white",
            }}
            styles={{ body:{ padding: "40px" }}}
          >
            <Title level={3} style={{ color: "white", marginBottom: 16 }}>
              שאלות על התנאים?
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, lineHeight: 1.6 }}>
              אם יש לך שאלות או הבהרות בנוגע לתנאי השימוש, אנא צור איתנו קשר:
            </Paragraph>
            <div style={{ color: "rgba(255,255,255,0.9)" }}>
              <div style={{ marginBottom: 8 }}>
                📧 <strong>אימייל:</strong> brurya.zarbiv@gmail.com
              </div>
              <div style={{ marginBottom: 8 }}>
                📞 <strong>טלפון:</strong> 055-675-8244
              </div>
              <div>
                📍 <strong>כתובת:</strong> חתם סופר 16 עמנואל
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default TermsOfService
