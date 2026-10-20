import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider.jsx";

// ログインが必要なページを囲むコンポーネント
// 未ログインならログイン画面へリダイレクトし、ログイン後に元のページへ戻れるようにする
function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="loading">読み込み中…</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
