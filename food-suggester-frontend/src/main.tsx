import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import './index.css'

// Enregistrement du service worker pour la PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Une nouvelle version est disponible. Voulez-vous mettre à jour?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('L\'application est prête à fonctionner hors ligne')
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
