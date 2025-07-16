import { Route, Routes } from "react-router-dom";

export default function Default() {
  return (
    <Routes>
      <Route path="/" element={<h1>Default Layout</h1>} />
      <Route path="/login" element={<></>} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
}
