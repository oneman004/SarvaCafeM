import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SecondPage from "./pages/SecondPage";
import Menu from "./pages/Menu";
import OrderSummary from "./pages/OrderSummary";
import OrderConfirmed from "./pages/OrderConfirmed";
import Billing from "./pages/Billing";
import Payment from "./pages/Payment";
import Takeaway from "./pages/Takeaway";
import SignLanguage from "./pages/SignLanguage";
import FeedbackPage from "./pages/FeedbackPage";

import FloatingPDFButton from "./components/FloatingPDFButton";
import FloatingSignLanguageButton from "./components/FloatingSignLanguageButton";

export default function App() {
  return (
    <>
     
      <FloatingPDFButton/>
      <FloatingSignLanguageButton/>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/secondpage" element={<SecondPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/takeaway" element={<Takeaway />} />
        <Route path="/sign-language" element={<SignLanguage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </>
  );
}
