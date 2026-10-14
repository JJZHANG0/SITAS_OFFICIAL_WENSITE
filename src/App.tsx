import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteProvider } from './context/SiteContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { IntroducePage } from './pages/IntroducePage'
import { ProductPage } from './pages/ProductPage'
import { CasesPage } from './pages/CasesPage'
import { PartnershipPage } from './pages/PartnershipPage'
import { DevelopmentPage } from './pages/DevelopmentPage'
import { AboutPage } from './pages/AboutPage'

export default function App() {
  return (
    <SiteProvider>
      <BrowserRouter basename="/SITAS_OFFICIAL_WENSITE">
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="introduce" element={<IntroducePage />} />
            <Route path="product" element={<ProductPage />} />
            <Route path="cases" element={<CasesPage />} />
            <Route path="partnership" element={<PartnershipPage />} />
            <Route path="development" element={<DevelopmentPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SiteProvider>
  )
}
