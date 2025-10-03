/**
 * @file This is the main entry point for the Kopitalk React application.
 * It sets up the React DOM renderer, wraps the root `App` component with
 * `BrowserRouter` for routing capabilities, and enables `React.StrictMode`
 * for development-time checks.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)