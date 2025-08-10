import type { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import "./DualPillLink.css";

interface DualPillLinkProps {
  leftHref: string;
  rightHref: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export const DualPillLink: FunctionComponent<DualPillLinkProps> = ({
  leftHref,
  rightHref,
  leftContent = "Left",
  rightContent = "Right",
}) => {
  return (
    <div className="pill-container" role="group" aria-label="Dual action">
      <Link className="side side-left" to={leftHref}>
        <span className="content">{leftContent}</span>
      </Link>

      <Link className="side side-right" to={rightHref}>
        <span className="content">{rightContent}</span>
      </Link>
    </div>
  );
};

export default DualPillLink;
