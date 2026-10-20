import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "./AuthProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import PropertyListPage from "./pages/PropertyListPage.jsx";

// 画面の切り替え（ルーティング）
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
          <Route path="/properties" element={<ProtectedRoute><PropertyListPage /></ProtectedRoute>} />
          {/* トップや存在しない URL は物件一覧へ（未ログインならさらにログイン画面へ） */}
          <Route path="*" element={<Navigate to="/properties" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
