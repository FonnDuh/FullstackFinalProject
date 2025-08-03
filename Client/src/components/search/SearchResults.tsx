import type { FunctionComponent } from "react";
import type { Media } from "../../interfaces/Media/Media.interface";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import styles from "../../pages/Search.module.css";
import MediaCard from "../common/MediaCard";
interface SearchResultsProps {
  media: Media[];
}

const SearchResults: FunctionComponent<SearchResultsProps> = ({ media }) => {
  return (
    <>
      {media.length > 0 ? (
        <ScrollArea.Root className={styles.scrollRoot}>
          <ScrollArea.Viewport className={styles.scrollViewport}>
            <ul className={styles.mediaList}>
              {media.map((movie) => (
                <li key={movie.id}>
                  <MediaCard media={movie} genres={[]} />
                </li>
              ))}
            </ul>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className={styles.scrollbar}>
            <ScrollArea.Thumb className={styles.thumb} />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      ) : (
        <p>No media available.</p>
      )}
    </>
  );
};

export default SearchResults;
