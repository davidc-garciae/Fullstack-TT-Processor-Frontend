import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CardDeliveryPage } from '../../pages/card-delivery-page/CardDeliveryPage'
import { ProductPage } from '../../pages/product-page/ProductPage'
import { StatusPage } from '../../pages/status-page/StatusPage'
import { SummaryPage } from '../../pages/summary-page/SummaryPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/product" replace />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/card-delivery" element={<CardDeliveryPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/status" element={<StatusPage />} />
      </Routes>
    </BrowserRouter>
  )
}
