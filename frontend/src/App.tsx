import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import Crops from './pages/Crops'
import Weather from './pages/Weather'
import Market from './pages/Market'
import Inputs from './pages/Inputs'
import Expenses from './pages/Expenses'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/market" element={<Market />} />
        <Route path="/inputs" element={<Inputs />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}
