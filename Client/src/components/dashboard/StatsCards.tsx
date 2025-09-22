import { type FunctionComponent } from "react";

type Stat = {
  key: string;
  label: string;
  icon: string;
  count: number | string;
};

type Props = {
  stats: Stat[];
};

const StatsCards: FunctionComponent<Props> = ({ stats }) => {
  return (
    <section className="dashboard__stats">
      {stats.map((s) => (
        <div
          key={s.key}
          className="stat-card"
          role="group"
          aria-label={s.label}>
          <div className="stat-card__icon" aria-hidden>
            {s.icon}
          </div>
          <div className="stat-card__body">
            <div className="stat-card__count">{s.count}</div>
            <div className="stat-card__label">{s.label}</div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatsCards;
