import { type FunctionComponent } from "react";

const RecentActivity: FunctionComponent = () => {
  return (
    <section className="dashboard__activity card">
      <h4>No recent activity</h4>
      <p>Your timeline will show plays, progress and interactions here.</p>
      <ul className="activity-list">
        <li className="activity-list__empty">No activity to show</li>
      </ul>
    </section>
  );
};

export default RecentActivity;
