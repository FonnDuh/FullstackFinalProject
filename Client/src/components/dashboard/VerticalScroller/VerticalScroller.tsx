import type { FunctionComponent } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import type { Media } from "../../../interfaces/Media/Media.interface";
import type { Genre } from "../../../interfaces/Media/Genre.interface";
import ErrorBoundary from "../../feedback/ErrorBoundary";
import MediaCard from "../../common/MediaCard/MediaCard";
import "./VerticalScroller.css";

interface VerticalScrollerProps {
  mediaType: string;
  media: Media[];
  genres: Genre[];
  timeFrame?: "day" | "week";
  setTimeframe?: React.Dispatch<React.SetStateAction<"day" | "week">>;
}

const VerticalScroller: FunctionComponent<VerticalScrollerProps> = ({
  mediaType,
  media,
  genres,
  timeFrame,
  setTimeframe,
}) => {
  return (
    <section className="sectionWrapper">
      <div className="sectionHeader">
        <h2 className="sectionTitle">{mediaType}</h2>
        {timeFrame && setTimeframe ? (
          <ToggleGroup.Root
            type="single"
            value={timeFrame}
            onValueChange={(val: "day" | "week") => val && setTimeframe(val)}
            className="toggleGroup">
            <ToggleGroup.Item value="day" className="toggleBtn">
              Today
            </ToggleGroup.Item>
            <ToggleGroup.Item value="week" className="toggleBtn">
              This Week
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        ) : (
          ""
        )}
      </div>

      <div className="mediaScrollContainer">
        <ul className="mediaRowList">
          {media.map((media) => (
            <li key={media.id} className="mediaItem">
              <ErrorBoundary>
                <MediaCard media={media} genres={genres} />
              </ErrorBoundary>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default VerticalScroller;
