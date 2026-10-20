import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { toJapaneseMessage } from "../authErrors.js";

// ログイン画面
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // リダイレクト前に開こうとしていたページ（なければ物件一覧）
  const from = location.state?.from ?? "/properties";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);
    if (error) {
      setError(toJapaneseMessage(error));
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>ログイン</h1>

        <label>
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "ログイン中…" : "ログイン"}
        </button>

        <p className="auth-switch">
          アカウントをお持ちでない方は <Link to="/signup">会員登録</Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;
