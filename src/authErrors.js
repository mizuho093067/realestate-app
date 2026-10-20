// Supabase のエラーコードを日本語のメッセージに変換する
const messages = {
  invalid_credentials: "メールアドレスまたはパスワードが正しくありません。",
  email_not_confirmed: "メールアドレスの確認が済んでいません。届いた確認メールのリンクを開いてください。",
  user_already_exists: "このメールアドレスはすでに登録されています。",
  email_exists: "このメールアドレスはすでに登録されています。",
  weak_password: "パスワードが短すぎるか、簡単すぎます。6文字以上で設定してください。",
  email_address_invalid: "メールアドレスの形式が正しくありません。",
  over_email_send_rate_limit: "メールの送信回数が上限に達しました。しばらく待ってから再度お試しください。",
  over_request_rate_limit: "リクエストが多すぎます。しばらく待ってから再度お試しください。",
  signup_disabled: "現在、新規登録を受け付けていません。",
};

export function toJapaneseMessage(error) {
  return messages[error.code] ?? `エラーが発生しました: ${error.message}`;
}
