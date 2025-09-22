import { useEffect, useState, type FunctionComponent } from "react";
import {
  getPopularMedia,
  getTopRatedMedia,
} from "../../services/tmdb/tmdb.service";
import type { Media } from "../../interfaces/Media/Media.interface";
import VerticalScroller from "../../components/dashboard/VerticalScroller/VerticalScroller";
import MediaCard from "../../components/common/MediaCard/MediaCard";
import "./Browsing.css";

const Browsing: FunctionComponent = () => {
  const [popularMovies, setPopularMovies] = useState<Media[]>([]);
  const [popularMoviesPage, setPopularMoviesPage] = useState<number>(1);
  const [popularMoviesTotal, setPopularMoviesTotal] = useState<number>(1);

  const [popularTv, setPopularTv] = useState<Media[]>([]);
  const [popularTvPage, setPopularTvPage] = useState<number>(1);
  const [popularTvTotal, setPopularTvTotal] = useState<number>(1);

  const [topRatedMovies, setTopRatedMovies] = useState<Media[]>([]);
  const [topRatedPage, setTopRatedPage] = useState<number>(1);
  const [topRatedTotal, setTopRatedTotal] = useState<number>(1);

  const [loadingMovies, setLoadingMovies] = useState<boolean>(true);
  const [loadingTv, setLoadingTv] = useState<boolean>(true);
  const [loadingTopRated, setLoadingTopRated] = useState<boolean>(true);

  useEffect(() => {
    setLoadingMovies(true);
    getPopularMedia("movie", popularMoviesPage)
      .then((res) => {
        setPopularMovies(res.data.results ?? []);
        setPopularMoviesTotal(res.data.total_pages ?? 1);
      })
      .catch((err) => console.error("Popular movies load failed", err))
      .finally(() => setLoadingMovies(false));
  }, [popularMoviesPage]);

  useEffect(() => {
    setLoadingTv(true);
    getPopularMedia("tv", popularTvPage)
      .then((res) => {
        setPopularTv(res.data.results ?? []);
        setPopularTvTotal(res.data.total_pages ?? 1);
      })
      .catch((err) => console.error("Popular tv load failed", err))
      .finally(() => setLoadingTv(false));
  }, [popularTvPage]);

  useEffect(() => {
    setLoadingTopRated(true);
    getTopRatedMedia("movie", topRatedPage)
      .then((res) => {
        setTopRatedMovies(res.data.results ?? []);
        setTopRatedTotal(res.data.total_pages ?? 1);
      })
      .catch((err) => console.error("Top rated movies load failed", err))
      .finally(() => setLoadingTopRated(false));
  }, [topRatedPage]);

  return (
    <div className="browsing-page">
      <h1 className="browsing-title">Discover</h1>

      <section className="browsing-grid">
        <h2>Popular Movies</h2>
        {loadingMovies ? (
          <div className="section-loading">Loading popular movies...</div>
        ) : (
          <>
            <div className="card-grid">
              {popularMovies.map((m) => (
                <MediaCard key={`movie-${m.id}`} media={m} genres={[]} />
              ))}
            </div>
            <div className="pagination">
              <button
                onClick={() => setPopularMoviesPage((p) => Math.max(1, p - 1))}
                disabled={popularMoviesPage <= 1 || loadingMovies}
                className="page-btn">
                Prev
              </button>
              <span className="page-info">
                Page {popularMoviesPage} of {popularMoviesTotal}
              </span>
              <button
                onClick={() =>
                  setPopularMoviesPage((p) =>
                    Math.min(popularMoviesTotal, p + 1)
                  )
                }
                disabled={
                  popularMoviesPage >= popularMoviesTotal || loadingMovies
                }
                className="page-btn">
                Next
              </button>
            </div>
          </>
        )}
      </section>

      <section className="browsing-grid">
        <h2>Popular TV</h2>
        {loadingTv ? (
          <div className="section-loading">Loading popular TV...</div>
        ) : (
          <>
            <div className="card-grid">
              {popularTv.map((m) => (
                <MediaCard key={`tv-${m.id}`} media={m} genres={[]} />
              ))}
            </div>
            <div className="pagination">
              <button
                onClick={() => setPopularTvPage((p) => Math.max(1, p - 1))}
                disabled={popularTvPage <= 1 || loadingTv}
                className="page-btn">
                Prev
              </button>
              <span className="page-info">
                Page {popularTvPage} of {popularTvTotal}
              </span>
              <button
                onClick={() =>
                  setPopularTvPage((p) => Math.min(popularTvTotal, p + 1))
                }
                disabled={popularTvPage >= popularTvTotal || loadingTv}
                className="page-btn">
                Next
              </button>
            </div>
          </>
        )}
      </section>

      {loadingTopRated ? (
        <div className="section-loading">Loading top rated movies...</div>
      ) : (
        <>
          <VerticalScroller
            mediaType="Top Rated - Movies"
            media={topRatedMovies}
            genres={[]}
          />
          <div className="pagination pagination--scroller">
            <button
              onClick={() => setTopRatedPage((p) => Math.max(1, p - 1))}
              disabled={topRatedPage <= 1 || loadingTopRated}
              className="page-btn">
              Prev
            </button>
            <span className="page-info">
              Page {topRatedPage} of {topRatedTotal}
            </span>
            <button
              onClick={() =>
                setTopRatedPage((p) => Math.min(topRatedTotal, p + 1))
              }
              disabled={topRatedPage >= topRatedTotal || loadingTopRated}
              className="page-btn">
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Browsing;
