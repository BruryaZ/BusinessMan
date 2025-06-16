"use client"

import type React from "react"
import { useState } from "react"
import { Form, Input, Button, Card, Row, Col, Typography, Space, message, ConfigProvider, Avatar } from "antd"
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
//   CustomerServiceOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

const ContactUs: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: ContactFormData) => {
    setLoading(true)
    try {
      // כאן תוכל להוסיף את הלוגיקה לשליחת הטופס
      console.log("Contact form data:", values)

      // סימולציה של שליחה
      await new Promise((resolve) => setTimeout(resolve, 2000))

      message.success("הודעתך נשלחה בהצלחה! נחזור אליך בהקדם האפשרי.")
      form.resetFields()
    } catch (error) {
      message.error("אירעה שגיאה בשליחת ההודעה. אנא נסה שוב.")
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <MailOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
      title: "אימייל",
      content: "brurya.zarbiv@gmail.com",
      description: "שלחו אלינו מייל ונשתדל לחזור תוך 2 ימי עסקים",
    },
    {
      icon: <PhoneOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      title: "טלפון (למקרים דחופים בלבד :)",
      content: "055-675-8244",
      description: "ימים א'-ה' 9:00-18:00",
    },
    {
      icon: <EnvironmentOutlined style={{ fontSize: 24, color: "#fa8c16" }} />,
      title: "כתובת",
      content: "חתם סופר 16 עמנואל",
      description: "קומה 4 ",
    },
    // {
    //   icon: <CustomerServiceOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
    //   title: "תמיכה טכנית",
    //   content: "help@businessman.co.il",
    //   description: "זמינים 24/7",
    // },
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
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Avatar
              size={80}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                marginBottom: 24,
              }}
            >
              <MailOutlined style={{ fontSize: 40 }} />
            </Avatar>
            <Title level={1} style={{ color: "#2d3748", marginBottom: 16 }}>
              צור קשר
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
              יש לך שאלות? רוצה לדעת יותר על המערכת? אנחנו כאן לעזור!
              <br />
              צור איתנו קשר ונחזור אליך בהקדם האפשרי.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {/* Contact Form */}
            <Col xs={24} lg={14}>
              <Card
                style={{
                  borderRadius: 20,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
                bodyStyle={{ padding: "40px" }}
              >
                <div style={{ marginBottom: 32 }}>
                  <Title level={3} style={{ color: "#2d3748", marginBottom: 8 }}>
                    שלח לנו הודעה
                  </Title>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    מלא את הפרטים למטה ונחזור אליך בהקדם
                  </Text>
                </div>

                <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
                  <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="name"
                        label="שם מלא"
                        rules={[
                          { required: true, message: "אנא הזן את שמך המלא" },
                          { min: 2, message: "השם חייב להכיל לפחות 2 תווים" },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                          placeholder="הזן את שמך המלא"
                          style={{ borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="email"
                        label="כתובת אימייל"
                        rules={[
                          { required: true, message: "אנא הזן כתובת אימייל" },
                          { type: "email", message: "אנא הזן כתובת אימייל תקינה" },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
                          placeholder="your@email.com"
                          style={{ borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12}>
                      <Form.Item name="phone" label="מספר טלפון (אופציונלי)">
                        <Input
                          prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
                          placeholder="050-1234567"
                          style={{ borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="subject"
                        label="נושא"
                        rules={[{ required: true, message: "אנא הזן נושא להודעה" }]}
                      >
                        <Input placeholder="נושא ההודעה" style={{ borderRadius: 8 }} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="message"
                    label="הודעה"
                    rules={[
                      { required: true, message: "אנא כתב את ההודעה" },
                      { min: 10, message: "ההודעה חייבת להכיל לפחות 10 תווים" },
                    ]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="כתב כאן את ההודעה שלך..."
                      showCount
                      maxLength={500}
                      style={{ borderRadius: 8 }}
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SendOutlined />}
                    block
                    style={{
                      height: 50,
                      borderRadius: 25,
                      fontWeight: 600,
                      fontSize: 16,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    }}
                  >
                    {loading ? "שולח הודעה..." : "שלח הודעה"}
                  </Button>
                </Form>
              </Card>
            </Col>

            {/* Contact Information */}
            <Col xs={24} lg={10}>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    style={{
                      borderRadius: 16,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                      border: "none",
                    }}
                    bodyStyle={{ padding: "24px" }}
                  >
                    <Space align="start" size="middle">
                      <Avatar
                        size={48}
                        style={{
                          background: `${info.icon.props.style.color}15`,
                          border: `2px solid ${info.icon.props.style.color}20`,
                        }}
                      >
                        {info.icon}
                      </Avatar>
                      <div>
                        <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                          {info.title}
                        </Title>
                        <Text strong style={{ fontSize: 16, color: "#2d3748" }}>
                          {info.content}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 14 }}>
                          {info.description}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                ))}

                {/* Working Hours */}
                <Card
                  style={{
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    color: "white",
                  }}
                  bodyStyle={{ padding: "24px" }}
                >
                  <Space align="start" size="middle">
                    <Avatar
                      size={48}
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        color: "white",
                      }}
                    >
                      <ClockCircleOutlined style={{ fontSize: 24 }} />
                    </Avatar>
                    <div>
                      <Title level={5} style={{ margin: 0, marginBottom: 8, color: "white" }}>
                        שעות פעילות
                      </Title>
                      <div style={{ color: "rgba(255,255,255,0.9)" }}>
                        <div>ימים א'-ה': 9:00-18:00</div>
                        <div>יום ו': 9:00-13:00</div>
                        <div>שבת: סגור</div>
                      </div>
                    </div>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>

          {/* FAQ Section */}
          <Card
            style={{
              marginTop: 60,
              borderRadius: 20,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
            bodyStyle={{ padding: "40px" }}
          >
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <Title level={2} style={{ color: "#2d3748" }}>
                שאלות נפוצות
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                תשובות לשאלות הנפוצות ביותר
              </Text>
            </div>

            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 24 }}>
                  <Title level={4} style={{ color: "#2d3748", marginBottom: 8 }}>
                    כמה זמן לוקח לקבל תשובה?
                  </Title>
                  <Text type="secondary" style={{ lineHeight: 1.6 }}>
                    אנחנו מתחייבים לחזור אליך תוך 2 ימי עסקים. לבקשות דחופות, אנא צור קשר טלפונית.
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 24 }}>
                  <Title level={4} style={{ color: "#2d3748", marginBottom: 8 }}>
                    האם יש תמיכה טכנית?
                  </Title>
                  <Text type="secondary" style={{ lineHeight: 1.6 }}>
                    כרגע עדיין לא. תוכל ליצור קשר באמצעות המייל או הטלפון המופיעים למעלה, ונשמח לעזור בכל שאלה.
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default ContactUs
