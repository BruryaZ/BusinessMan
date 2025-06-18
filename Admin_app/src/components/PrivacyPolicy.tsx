"use client"

import type React from "react"
import { Typography, Card, ConfigProvider, Avatar, Row, Col, Timeline, Alert } from "antd"
import {
  CheckOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  SafetyOutlined,
  UserOutlined,
  DatabaseOutlined,
} from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography

const PrivacyPolicy: React.FC = () => {
  const privacySections = [
    {
      icon: <DatabaseOutlined style={{ color: "#1890ff" }} />,
      title: "איסוף מידע",
      content: [
        "אנו אוספים מידע אישי שאתה מספק לנו בעת הרשמה למערכת",
        "מידע על השימוש שלך במערכת לשיפור השירות",
        "מידע טכני כמו כתובת IP וסוג דפדפן",
        "מידע עסקי הנדרש לתפעול המערכת",
      ],
    },
    {
      icon: <LockOutlined style={{ color: "#52c41a" }} />,
      title: "שימוש במידע",
      content: [
        "מתן השירותים המבוקשים על ידך",
        "שיפור וטיוב המערכת והשירותים",
        "יצירת קשר איתך בנושאים רלוונטיים",
        "עמידה בדרישות חוקיות ורגולטוריות",
      ],
    },
    {
      icon: <SafetyOutlined style={{ color: "#fa8c16" }} />,
      title: "אבטחת מידע",
      content: [
        "הצפנה מתקדמת של כל המידע הרגיש",
        "גיבויים קבועים ומאובטחים",
        "הגבלת גישה למידע לעובדים מורשים בלבד",
        "מעקב ובקרה על כל פעילות במערכת",
      ],
    },
    {
      icon: <EyeInvisibleOutlined style={{ color: "#722ed1" }} />,
      title: "שיתוף מידע",
      content: [
        "איננו מוכרים או משתפים מידע אישי עם צדדים שלישיים",
        "שיתוף מידע רק במקרים חוקיים נדרשים",
        "שיתוף מידע עם ספקי שירות מורשים בלבד",
        "קבלת הסכמה מפורשת לכל שיתוף מידע",
      ],
    },
  ]

  const userRights = [
    "זכות עיון במידע האישי השמור עליך",
    "זכות תיקון מידע שגוי או לא מדויק",
    "זכות מחיקת מידע אישי",
    "זכות הגבלת עיבוד המידע",
    "זכות העברת מידע למערכת אחרת",
    "זכות התנגדות לעיבוד מידע",
  ]

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
                background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                marginBottom: 24,
              }}
            >
              <CheckOutlined style={{ fontSize: 40 }} />
            </Avatar>
            <Title level={1} style={{ color: "#2d3748", marginBottom: 16 }}>
              מדיניות פרטיות
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
              אנו מתחייבים להגן על הפרטיות שלך ולשמור על המידע האישי שלך בצורה מאובטחת ואחראית.
            </Paragraph>
          </div>

          {/* Last Updated */}
          <Alert
            message="עדכון אחרון: 15 בדצמבר 2024"
            description="מדיניות הפרטיות עודכנה לאחרונה בתאריך זה. אנא קרא בעיון את השינויים."
            type="info"
            showIcon
            style={{ marginBottom: 40, borderRadius: 12 }}
          />

          {/* Main Content */}
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
              ברוכים הבאים למערכת BusinessMan. אנו מכבדים את פרטיותך ומתחייבים להגן על המידע האישי שלך. מדיניות פרטיות
              זו מסבירה כיצד אנו אוספים, משתמשים, ומגנים על המידע שלך כאשר אתה משתמש בשירותים שלנו.
            </Paragraph>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.7, color: "#4a5568" }}>
              על ידי שימוש במערכת שלנו, אתה מסכים לתנאים המפורטים במדיניות פרטיות זו. אם אינך מסכים לתנאים אלה, אנא
              הימנע משימוש במערכת.
            </Paragraph>
          </Card>

          {/* Privacy Sections */}
          <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
            {privacySections.map((section, index) => (
              <Col xs={24} md={12} key={index}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: 16,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    border: "none",
                  }}
                  styles={{ body:{ padding: "24px" }}}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <Avatar
                      size={40}
                      style={{
                        background: `${section.icon.props.style.color}15`,
                        marginLeft: 12,
                      }}
                    >
                      {section.icon}
                    </Avatar>
                    <Title level={4} style={{ margin: 0, color: "#2d3748" }}>
                      {section.title}
                    </Title>
                  </div>
                  <ul style={{ paddingRight: 20, margin: 0 }}>
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} style={{ marginBottom: 8 }}>
                        <Text style={{ color: "#4a5568", lineHeight: 1.6 }}>{item}</Text>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>

          {/* User Rights */}
          <Card
            style={{
              borderRadius: 20,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              border: "none",
              marginBottom: 40,
            }}
            styles={{ body:{ padding: "40px" }}}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
              <Avatar
                size={48}
                style={{
                  background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
                  marginLeft: 16,
                }}
              >
                <UserOutlined style={{ fontSize: 24 }} />
              </Avatar>
              <Title level={2} style={{ margin: 0, color: "#2d3748" }}>
                הזכויות שלך
              </Title>
            </div>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.7, color: "#4a5568", marginBottom: 24 }}>
              כמשתמש במערכת שלנו, יש לך זכויות חשובות בנוגע למידע האישי שלך:
            </Paragraph>
            <Timeline
              items={userRights.map((right, index) => ({
                children: <Text style={{ fontSize: 16, color: "#4a5568" }}>{right}</Text>,
                color: index % 2 === 0 ? "#1890ff" : "#52c41a",
              }))}
            />
          </Card>

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
              יש לך שאלות?
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, lineHeight: 1.6 }}>
              אם יש לך שאלות או חששות בנוגע למדיניות הפרטיות שלנו, אנא צור איתנו קשר:
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

export default PrivacyPolicy
