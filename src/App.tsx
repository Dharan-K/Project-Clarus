import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import { ConsoleLayout } from "./components/console/ConsoleLayout";
import Dashboard from "./pages/console/Dashboard";
import InvoiceQueue from "./pages/console/InvoiceQueue";
import InvoiceDetail from "./pages/console/InvoiceDetail";
import ProcessFlow from "./pages/console/ProcessFlow";
import Agents from "./pages/console/Agents";
import Governance from "./pages/console/Governance";
import Settings from "./pages/console/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<ConsoleLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="invoices" element={<InvoiceQueue />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        <Route path="process" element={<ProcessFlow />} />
        <Route path="agents" element={<Agents />} />
        <Route path="governance" element={<Governance />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
