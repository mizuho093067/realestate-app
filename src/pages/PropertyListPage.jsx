import { useState } from "react";
import { useAuth } from "../AuthProvider.jsx";
import { supabase } from "../supabaseClient.js";
import { properties } from "../data/properties.js";
import PropertyCard from "../components/PropertyCard.jsx";

// 物件一覧画面（ログイン後に表示）
function PropertyListPage() {
  const { user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    // ログアウトするとセッションが消え、ProtectedRoute がログイン画面へ移動させる
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoggingOut(false);
      alert(`ログアウトに失敗しました: ${error.message}`);
    }
  }

  return (
    <div className="property-page">
      <header className="app-header">
        <h1>物件一覧</h1>
        <div className="app-header-user">
          <span className="user-email">{user?.email}</span>
          <button type="button" className="logout-button" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "ログアウト中…" : "ログアウト"}
          </button>
        </div>
      </header>

      <main>
        <p className="property-count">{properties.length}件の物件</p>
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default PropertyListPage;
