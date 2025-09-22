import { type FunctionComponent } from "react";

type Props = {
  username: string;
  formattedDate: string;
};

const WelcomeSection: FunctionComponent<Props> = ({
  username,
  formattedDate,
}) => {
  return (
    <header className="dashboard__header">
      <div className="dashboard__title">
        <h1>Hello, {username ?? "guest"}!</h1>
        <p className="dashboard__subtitle">
          Ready to dive into your media universe?
        </p>
      </div>
      <div className="dashboard__meta">
        <div className="dashboard__date">{formattedDate}</div>
        <div className="dashboard__reminder">Keep tracking!</div>
      </div>
    </header>
  );
};

export default WelcomeSection;
