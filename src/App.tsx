import { Routes, Route } from "react-router-dom";
import HomePage from "@pages/HomePage";
import LoadingPage from "@pages/LoadingPage";
import InventoryPage from "@pages/InventoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
    </Routes>
  );
}

export default App;
