import { useState } from "react";

// 間取りの入力候補（候補にない間取りも自由に入力できる）
const LAYOUT_OPTIONS = ["1R", "1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3LDK", "4LDK"];

const EMPTY_VALUES = { name: "", rent: "", area: "", layout: "" };

// 物件の登録・編集フォーム
// initialProperty があれば編集、なければ新規登録として使う
function PropertyForm({ initialProperty, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(() =>
    initialProperty
      ? {
          name: initialProperty.name,
          rent: String(initialProperty.rent),
          area: initialProperty.area,
          layout: initialProperty.layout,
        }
      : EMPTY_VALUES
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    // 前後の空白を除いてから保存する
    const property = {
      name: values.name.trim(),
      rent: Number(values.rent),
      area: values.area.trim(),
      layout: values.layout.trim(),
    };

    if (!property.name || !property.area || !property.layout) {
      setError("すべての項目を入力してください。");
      return;
    }
    if (values.rent === "" || !Number.isInteger(property.rent) || property.rent < 0) {
      setError("家賃は0以上の整数（円）で入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(property);
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <label>
        物件名
        <input name="name" value={values.name} onChange={handleChange} maxLength={100} required />
      </label>

      <label>
        家賃（円 / 月）
        <input
          name="rent"
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          value={values.rent}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        エリア名
        <input
          name="area"
          value={values.area}
          onChange={handleChange}
          placeholder="例: 東京都渋谷区"
          maxLength={100}
          required
        />
      </label>

      <label>
        間取り
        <input
          name="layout"
          value={values.layout}
          onChange={handleChange}
          list="layout-options"
          placeholder="例: 1LDK"
          maxLength={20}
          required
        />
        <datalist id="layout-options">
          {LAYOUT_OPTIONS.map((layout) => (
            <option key={layout} value={layout} />
          ))}
        </datalist>
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-buttons">
        <button type="button" className="secondary-button" onClick={onCancel} disabled={submitting}>
          キャンセル
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? "保存中…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default PropertyForm;
