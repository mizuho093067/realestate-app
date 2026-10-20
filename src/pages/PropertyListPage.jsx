import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider.jsx";
import { supabase } from "../supabaseClient.js";
import { createProperty, deleteProperty, fetchProperties, updateProperty } from "../propertiesApi.js";
import PropertyCard from "../components/PropertyCard.jsx";
import PropertyForm from "../components/PropertyForm.jsx";

// 物件一覧画面（ログイン後に表示）
function PropertyListPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  // 新規登録フォームを開いているか
  const [creating, setCreating] = useState(false);
  // 編集中の物件の ID（編集していなければ null）
  const [editingId, setEditingId] = useState(null);
  // 削除処理中の物件の ID
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // 画面を開いたときに自分の物件を読み込む
  useEffect(() => {
    let ignore = false;

    fetchProperties()
      .then((data) => {
        if (!ignore) setProperties(data);
      })
      .catch((e) => {
        if (!ignore) setLoadError(e.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    // 画面を離れたあとに結果が返ってきても state を更新しない
    return () => {
      ignore = true;
    };
  }, []);

  async function addProperty(values) {
    const created = await createProperty(values);
    setProperties((current) => [created, ...current]);
    setCreating(false);
  }

  async function saveProperty(id, values) {
    const updated = await updateProperty(id, values);
    setProperties((current) => current.map((p) => (p.id === id ? updated : p)));
    setEditingId(null);
  }

  async function removeProperty(property) {
    if (!window.confirm(`「${property.name}」を削除しますか？この操作は取り消せません。`)) return;

    setActionError("");
    setDeletingId(property.id);
    try {
      await deleteProperty(property.id);
      setProperties((current) => current.filter((p) => p.id !== property.id));
    } catch (e) {
      setActionError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  function handleStartCreate() {
    setEditingId(null);
    setCreating(true);
  }

  function handleStartEdit(id) {
    setCreating(false);
    setEditingId(id);
  }

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
          <button type="button" className="secondary-button" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "ログアウト中…" : "ログアウト"}
          </button>
        </div>
      </header>

      <main>
        {loading && <p className="loading">読み込み中…</p>}
        {loadError && <p className="form-error">{loadError}</p>}

        {!loading && !loadError && (
          <>
            <div className="property-toolbar">
              <p className="property-count">{properties.length}件の物件</p>
              {!creating && <button type="button" onClick={handleStartCreate}>＋ 物件を登録</button>}
            </div>

            {creating && (
              <section className="property-card">
                <h2 className="property-name">物件を登録</h2>
                <PropertyForm submitLabel="登録する" onSubmit={addProperty} onCancel={() => setCreating(false)} />
              </section>
            )}

            {actionError && <p className="form-error">{actionError}</p>}

            {properties.length === 0 && !creating && (
              <p className="empty-message">まだ物件が登録されていません。「＋ 物件を登録」から追加してください。</p>
            )}

            <div className="property-grid">
              {properties.map((property) =>
                property.id === editingId ? (
                  <section key={property.id} className="property-card">
                    <h2 className="property-name">物件を編集</h2>
                    <PropertyForm
                      initialProperty={property}
                      submitLabel="保存する"
                      onSubmit={(values) => saveProperty(property.id, values)}
                      onCancel={() => setEditingId(null)}
                    />
                  </section>
                ) : (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    deleting={property.id === deletingId}
                    onEdit={() => handleStartEdit(property.id)}
                    onDelete={() => removeProperty(property)}
                  />
                )
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default PropertyListPage;
