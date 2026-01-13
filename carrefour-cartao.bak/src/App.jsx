import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/Landing/LandingPage';
import QuizPage from './components/Quiz/QuizPage';
import CPFConsultPage from './components/CPFConsult/CPFConsultPage';
import ProcessingPage from './components/Processing/ProcessingPage';
import ApprovalPage from './components/Approval/ApprovalPage';
import BenefitsPage from './components/Benefits/BenefitsPage';
import CustomizationPage from './components/Customization/CustomizationPage';
import FormsPage from './components/Forms/FormsPage';
import DeliveryPage from './components/Delivery/DeliveryPage';
import PaymentPage from './components/Payment/PaymentPage';
import VirtualCardPage from './components/VirtualCard/VirtualCardPage';
import ConfirmationPage from './components/Confirmation/ConfirmationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/cpf" element={<CPFConsultPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/approval" element={<ApprovalPage />} />
        <Route path="/benefits" element={<BenefitsPage />} />
        <Route path="/customization" element={<CustomizationPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/virtual" element={<VirtualCardPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

