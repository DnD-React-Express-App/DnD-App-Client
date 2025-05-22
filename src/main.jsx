import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { AuthProviderWrapper } from './context/auth.context';
import { ItemProviderWrapper } from './context/item.context';
import { SpellProviderWrapper } from './context/spell.context';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProviderWrapper>
        <ItemProviderWrapper>
          <SpellProviderWrapper>
            <App />
          </SpellProviderWrapper>
        </ItemProviderWrapper>
      </AuthProviderWrapper>
    </BrowserRouter>
  </StrictMode>,
)
