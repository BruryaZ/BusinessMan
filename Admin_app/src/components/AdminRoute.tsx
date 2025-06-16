"use client"

import type { JSX } from "react"
import { useContext } from "react"
import { globalContext } from "../context/GlobalContext"
import { Result, Button, Card, ConfigProvider } from "antd"
import { StopOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAdmin } = useContext(globalContext)
  const navigate = useNavigate()

  if (isAdmin === false) {
    return (
      <ConfigProvider direction="rtl">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            padding: "20px",
          }}
        >
          <Card
            style={{
              maxWidth: 500,
              width: "100%",
              borderRadius: 20,
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              border: "none",
              textAlign: "center",
            }}
            bodyStyle={{
              padding: "40px 30px",
            }}
          >
            <Result
              icon={
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px auto",
                    boxShadow: "0 8px 25px rgba(255, 107, 107, 0.3)",
                  }}
                >
                  <StopOutlined style={{ fontSize: 60, color: "white" }} />
                </div>
              }
              title={
                <div style={{ marginBottom: 16 }}>
                  <h2
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#2d3748",
                      margin: 0,
                      marginBottom: 8,
                    }}
                  >
                    גישה נדחתה
                  </h2>
                  <div
                    style={{
                      width: 60,
                      height: 4,
                      background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                      borderRadius: 2,
                      margin: "0 auto",
                    }}
                  />
                </div>
              }
              subTitle={
                <div style={{ marginBottom: 32 }}>
                  <p
                    style={{
                      fontSize: 16,
                      color: "#718096",
                      lineHeight: 1.6,
                      margin: 0,
                      marginBottom: 8,
                    }}
                  >
                    אין לך הרשאה לצפות בדף זה
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#a0aec0",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    רק מנהלים יכולים לגשת לתוכן זה. אנא פנה למנהל המערכת לקבלת הרשאות.
                  </p>
                </div>
              }
              extra={
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/")}
                    style={{
                      height: 48,
                      padding: "0 32px",
                      borderRadius: 24,
                      fontWeight: 600,
                      fontSize: 16,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    }}
                  >
                    חזרה לדף הבית
                  </Button>
                  <Button
                    size="large"
                    onClick={() => navigate("/contact")}
                    style={{
                      height: 48,
                      padding: "0 32px",
                      borderRadius: 24,
                      fontWeight: 600,
                      fontSize: 16,
                      borderColor: "#d1d5db",
                      color: "#6b7280",
                    }}
                  >
                    צור קשר
                  </Button>
                </div>
              }
            />
          </Card>
        </div>
      </ConfigProvider>
    )
  }

  return children
}

export default AdminRoute
