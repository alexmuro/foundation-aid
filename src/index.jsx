import React from 'react'
import ReactDOM from 'react-dom/client'
import { authProvider } from "@availabs/ams" //"./modules/ams/src"
import { AUTH_HOST, PROJECT_NAME, CLIENT_HOST }  from './config'
import App from './App.jsx'
import './index.css'

const AuthEnabledApp = authProvider(App, { AUTH_HOST, PROJECT_NAME, CLIENT_HOST });

ReactDOM.createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      <AuthEnabledApp />
    </React.StrictMode>,
  )
