import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StatusBar, Style } from '@capacitor/status-bar'
import { KeepAwake } from '@capacitor-community/keep-awake'
import { Capacitor } from '@capacitor/core'
import { registerPlugin } from '@capacitor/core'

const HttpServer = registerPlugin('HttpServer')

if (Capacitor.isNativePlatform()) {
  StatusBar.hide().catch(() => {})
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {})
  KeepAwake.keepAwake().catch(() => {})
  
  // 启动 HTTP 服务器
  setTimeout(() => {
    HttpServer.start({ port: 3001 })
      .then(() => {
        console.log('✅ HTTP Server started on port 3001')
        localStorage.setItem('server_status', 'running')
      })
      .catch(err => {
        console.error('❌ Failed to start HTTP server:', err)
        localStorage.setItem('server_status', 'error: ' + err)
      })
  }, 1000)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
