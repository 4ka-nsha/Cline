import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import Weather from './pages/Weather'
import Market from './pages/Market'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/market" element={<Market />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}
