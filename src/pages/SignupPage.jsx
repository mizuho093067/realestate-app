import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { toJapaneseMessage } from "../authErrors.js";

// Supabase の初期設定でのパスワードの最小文字数
const MIN_PASSWORD_LENGTH = 6;

// 会員登録画面
function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (password !== passwordConfirm) {
      setError("パスワードと確認用パスワードが一致しません。");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // 確認メールのリンクを開いたあとに戻ってくる URL
      options: { emailRedirectTo: `${window.location.origin}/properties` },
    });
    setSubmitting(false);

    if (error) {
      setError(toJapaneseMessage(error));
      return;
    }

    // メール確認が有効な場合、登録済みのアドレスでもエラーにならず identities が空で返る
    if (data.user && data.user.identities?.length === 0) {
      setError("このメールアドレスはすでに登録されています。");
      return;
    }

    // メール確認が無効な設定なら、その場でログイン状態になる
    if (data.session) {
      navigate("/properties", { replace: true });
      return;
    }

    // メール確認が有効な設定なら、確認メールのリンクを開いてもらう
    setNotice(`${email} に確認メールを送信しました。メール内のリンクを開いて登録を完了してください。`);
    setPassword("");
    setPasswordConfirm("");
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>会員登録</h1>

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
          パスワード（{MIN_PASSWORD_LENGTH}文字以上）
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </label>

        <label>
          パスワード（確認）
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {notice && <p className="form-notice">{notice}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "登録中…" : "登録する"}
        </button>

        <p className="auth-switch">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </form>
    </main>
  );
}

export default SignupPage;
