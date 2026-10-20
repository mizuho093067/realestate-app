// 物件1件分のカード（編集・削除ボタン付き）
function PropertyCard({ property, deleting, onEdit, onDelete }) {
  return (
    <article className="property-card">
      <div className="property-card-header">
        <h2 className="property-name">{property.name}</h2>
        <span className="property-layout">{property.layout}</span>
      </div>
      <p className="property-rent">
        {property.rent.toLocaleString("ja-JP")}
        <span className="property-rent-unit">円 / 月</span>
      </p>
      <p className="property-area">{property.area}</p>

      <div className="property-actions">
        <button type="button" className="secondary-button" onClick={onEdit} disabled={deleting}>
          編集
        </button>
        <button type="button" className="danger-button" onClick={onDelete} disabled={deleting}>
          {deleting ? "削除中…" : "削除"}
        </button>
      </div>
    </article>
  );
}

export default PropertyCard;
