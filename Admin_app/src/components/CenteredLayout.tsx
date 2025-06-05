import { ConfigProvider } from "antd"
import type React from "react"

const CenteredLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider direction="rtl">
      <div className="centered-layout">
        <div style={{ width: "100%", maxWidth: 600, background: '#ffffff' }}>{children}</div>
      </div>
    </ConfigProvider>
  )
}

// כאן אמור להיות פתרון לצבע הרק וגבהי הקומפוננטות

export default CenteredLayout
