import './StatCard.css';

function StatCard({
  title,
  value,
  subtitle,
  extra,
  children
}) {

  return (

    <div className="stat-card">

      <h3>{title}</h3>
      <p>{value}</p>
      {
        subtitle &&
        <small>{subtitle}</small>
      }
      {
        extra &&
        <small>{extra}</small>
      }
      {children}

    </div>
  );
}

export default StatCard;