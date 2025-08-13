import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SecondPage from "./pages/SecondPage";
import Menu from "./pages/Menu";
import OrderSummary from "./pages/OrderSummary";
import OrderConfirmed from "./pages/OrderConfirmed";
import Billing from "./pages/Billing";
import Payment from "./pages/Payment";
import Takeaway from "./pages/Takeaway";
import FeedbackPage from "./pages/FeedbackPage";
import FloatingPDFButton from "./components/FloatingPDFButton";
import FloatingSignLanguageButton from "./components/FloatingSignLanguageButton";
import SignLanguage from "./pages/SignLanguage";
import SignName from "./pages/SignName";

export default function App() {
  const [activeModal, setActiveModal] = useState(null); // "pdf" | "sign" | null

  return (
    <>
    {/* <FloatingPDFButton
        accessibilityMode={false}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />
      <FloatingSignLanguageButton
        accessibilityMode={false}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />
    */}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/secondpage" element={<SecondPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/takeaway" element={<Takeaway />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/sign-name" element={<SignName />} /> 
        <Route path="/sign-language" element={<SignLanguage />} />
      </Routes>
    </>
  );
}
