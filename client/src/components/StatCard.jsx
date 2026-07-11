import "./StatCard.css";

function StatCard({
  title,
  value,
  subtitle,
  extra,
  children
}) {

  return (

    <div className="stat-card">

      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
      {
        subtitle &&
        <small className="stat-subtitle">{subtitle}</small>
      }
      {
        extra &&
        <small className="stat-subtitle">{extra}</small>
      }
      {children}

    </div>
  );
}

export default StatCard;