// 物件1件分のカード
function PropertyCard({ property }) {
  return (
    <article className="property-card">
      <h2 className="property-name">{property.name}</h2>
      <p className="property-rent">
        {property.rent.toLocaleString("ja-JP")}
        <span className="property-rent-unit">円 / 月</span>
      </p>
      <p className="property-area">{property.area}</p>
    </article>
  );
}

export default PropertyCard;
