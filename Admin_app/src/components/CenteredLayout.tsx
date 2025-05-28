import { ConfigProvider } from "antd"
import type React from "react"

const CenteredLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider direction="rtl">
      <div className="centered-layout">
        <div style={{ width: "100%", maxWidth: 600 }}>{children}</div>
      </div>
    </ConfigProvider>
  )
}

export default CenteredLayout
