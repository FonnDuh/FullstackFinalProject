import { Route, Routes } from "react-router-dom";
import NotFound from "../../components/common/NotFound";
import Dashboard from "../../pages/Dashboard";

export default function Default() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
