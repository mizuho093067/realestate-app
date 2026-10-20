import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider.jsx";

// ログイン画面・会員登録画面を囲むコンポーネント
// すでにログイン済みなら物件一覧画面へ移動する
function GuestRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <p className="loading">読み込み中…</p>;
  }

  if (session) {
    return <Navigate to="/properties" replace />;
  }

  return children;
}

export default GuestRoute;
