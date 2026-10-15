import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteProvider } from './context/SiteContext'
import { Layout } from './components/Layout'
import { LogoLoader } from './components/LogoLoader'
import { HomePage } from './pages/HomePage'
import { IntroducePage } from './pages/IntroducePage'
import { ProductPage } from './pages/ProductPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CasesPage } from './pages/CasesPage'
import { PartnershipPage } from './pages/PartnershipPage'
import { DevelopmentPage } from './pages/DevelopmentPage'
import { AboutPage } from './pages/AboutPage'
import { VerifyPage } from './pages/VerifyPage'

export default function App() {
  return (
    <SiteProvider>
      <BrowserRouter basename="/">
        <LogoLoader />
        <Routes>
          <Route index element={<HomePage />} />
          <Route element={<Layout />}>
            <Route path="introduce" element={<IntroducePage />} />
            <Route path="product" element={<ProductPage />} />
            <Route path="product/basic" element={<ProductDetailPage tier="basic" />} />
            <Route path="product/pro" element={<ProductDetailPage tier="pro" />} />
            <Route path="cases" element={<CasesPage />} />
            <Route path="verify" element={<VerifyPage />} />
            <Route path="partnership" element={<PartnershipPage />} />
            <Route path="development" element={<DevelopmentPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SiteProvider>
  )
}
