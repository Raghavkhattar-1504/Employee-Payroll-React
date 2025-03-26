import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouterModule from '../RouterModule.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterModule />
  </StrictMode>,
)
