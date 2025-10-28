import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setAutoFreeze } from 'immer'
import './index.css'
import App from './App'

setAutoFreeze(false)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
