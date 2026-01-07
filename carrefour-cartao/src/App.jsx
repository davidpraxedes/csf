import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './components/Landing/LandingPage';
import QuizPage from './components/Quiz/QuizPage';
import CPFConsultPage from './components/CPFConsult/CPFConsultPage';
import ProfessionalDataPage from './components/ProfessionalData/ProfessionalDataPage';
import KycPage from './components/Services/KycPage';
import ProcessingPage from './components/Processing/ProcessingPage';
import ApprovalPage from './components/Approval/ApprovalPage';
import BenefitsPage from './components/Benefits/BenefitsPage';
import CustomizationPage from './components/Customization/CustomizationPage';
import FormsPage from './components/Forms/FormsPage';
import ContractPage from './components/Legal/ContractPage';
import DeliveryPage from './components/Delivery/DeliveryPage';
import PaymentPage from './components/Payment/PaymentPage';
import VirtualCardPage from './components/VirtualCard/VirtualCardPage';
import ConfirmationPage from './components/Confirmation/ConfirmationPage';
import PageLoader from './components/Shared/PageLoader';
import LoginPage from './components/Admin/LoginPage';
import HomePage from './components/Admin/HomePage';
import OrdersPage from './components/Admin/OrdersPage';
import OrderDetailPage from './components/Admin/OrderDetailPage';
import KycApprovalPage from './components/Admin/KycApprovalPage';
import StatisticsPage from './components/Admin/StatisticsPage';
import NotificationsPage from './components/Admin/NotificationsPage';
import GatewaySettingsPage from './components/Admin/GatewaySettingsPage';
import FeesSettingsPage from './components/Admin/FeesSettingsPage';
import NotificationSettingsPage from './components/Admin/NotificationSettingsPage';
import AppearanceSettingsPage from './components/Admin/AppearanceSettingsPage';

// Componente wrapper para adicionar loading entre páginas
function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    // Sempre mostrar loading quando mudar de rota (exceto primeira carga)
    if (prevPath !== location.pathname) {
      setLoading(true);

      // Loading mínimo de 1 segundo
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Atualizar prevPath após o loading
  useEffect(() => {
    if (!loading) {
      setPrevPath(location.pathname);
    }
  }, [loading, location.pathname]);

  if (loading) {
    return <PageLoader message="Carregando página..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/cpf" element={<CPFConsultPage />} />
      <Route path="/professional-data" element={<ProfessionalDataPage />} />
      <Route path="/kyc" element={<KycPage />} />
      <Route path="/processing" element={<ProcessingPage />} />
      <Route path="/approval" element={<ApprovalPage />} />
      <Route path="/benefits" element={<BenefitsPage />} />
      <Route path="/customization" element={<CustomizationPage />} />
      <Route path="/forms" element={<FormsPage />} />
      <Route path="/forms" element={<FormsPage />} />
      <Route path="/contract" element={<ContractPage />} />
      <Route path="/delivery" element={<DeliveryPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/virtual" element={<VirtualCardPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<HomePage />} />
      <Route path="/admin/orders" element={<OrdersPage />} />
      <Route path="/admin/orders/:orderId" element={<OrderDetailPage />} />
      <Route path="/admin/kyc" element={<KycApprovalPage />} />
      <Route path="/admin/statistics" element={<StatisticsPage />} />
      <Route path="/admin/notifications" element={<NotificationsPage />} />
      <Route path="/admin/settings/gateway" element={<GatewaySettingsPage />} />
      <Route path="/admin/settings/fees" element={<FeesSettingsPage />} />
      <Route path="/admin/settings/notifications" element={<NotificationSettingsPage />} />
      <Route path="/admin/settings/appearance" element={<AppearanceSettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

