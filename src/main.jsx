/**
 * @license
 * Licensed under CC BY-NC 4.0
 * https://creativecommons.org/licenses/by-nc/4.0/
 * Author: Sandiego Vieira
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { createHead, UnheadProvider } from '@unhead/react/client'
import './index.css'
import App from './App.jsx'
import './i18n';

const head = createHead();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <UnheadProvider head={head}>
      <App />
    </UnheadProvider>
    </BrowserRouter>
  </StrictMode>
)
