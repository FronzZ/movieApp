import { Alert, Spin } from 'antd';

import { networkStore, stateStore } from '../../data/stores/useMovieStore';
import MovieCard from '../MovieCard/MovieCard';
import './MovieList.css';

export default function MovieList() {
   const [movies, isLoading, isError, noResults] = networkStore((state) => [
      state.movies,
      state.isLoading,
      state.isError,
      state.noResults,
   ]);
   const [inputValue, headerCurrentTab] = stateStore((state) => [state.inputValue, state.headerCurrentTab]);

   return (
      <>
         {headerCurrentTab === '1' && inputValue && noResults && (
            <Alert
               message="Info"
               description={
                  <span>
                     Nothing found for the query: &quot;<b>{inputValue}</b>&quot;
                  </span>
               }
               type="info"
               showIcon
            />
         )}

         {headerCurrentTab === '2' && noResults && (
            <Alert message="Info" description={<span>No movies have been rated</span>} type="info" showIcon />
         )}

         {isError && (
            <Alert
               message="Error"
               description="Something has gone  wrong. We're already fixing it."
               type="error"
               showIcon
            />
         )}

         {isLoading && (
            <Spin tip="Loading" size="large" style={{ height: '100px' }}>
               <div className="content" />
            </Spin>
         )}

         {!isLoading && !isError && !noResults && (
            <ul className="card-list">
               {movies.map((movie) => (
                  <MovieCard
                     key={movie.id}
                     id={movie.id}
                     title={movie.title}
                     description={movie.overview}
                     releaseDate={movie.release_date}
                     poster={movie.poster_path}
                     raiting={movie.vote_average}
                     userRaiting={movie.rating}
                     genres={movie.genre_ids}
                  />
               ))}
            </ul>
         )}
      </>
   );
}
