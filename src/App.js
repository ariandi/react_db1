import React, {useCallback, useEffect, useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {

  const [movie, setMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
          const response = await fetch('https://swapi.dev/api/films/')

          if(!response.ok) {
              throw new Error('Something when wrong!');
          }

          const data = await response.json();
          const transformedMovies = await data.results.map(movieData => {
              return {
                  id: movieData.episode_id,
                  title: movieData.title,
                  openingText: movieData.opening_crawl,
                  releaseDate: movieData.release_date,
              }
          });

          await setMovie(transformedMovies);
      } catch (e) {
          setError(e.message);
      }
      setIsLoading(false);
  });

  useEffect(async () => {
      await fetchMovieHandler();
  }, [fetchMovieHandler]);

  let content = '';

  if (!isLoading && movie.length > 0) {
      content = <MoviesList movies={movie} />;
  }

  if (!isLoading && movie.length === 0 && !error) {
      content = <p>No movie find.</p>;
  }

  if (!isLoading && error) {
      content = <p>{error}</p>;
  }

  if (isLoading) {
      content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
          {content}
      </section>
    </React.Fragment>
  );
}

export default App;
