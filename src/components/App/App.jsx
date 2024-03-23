import { Layout } from 'antd';
import { useEffect } from 'react';

import { networkStore } from '../../data/stores/useMovieStore';
import MovieHeader from '../MovieHeader/MovieHeader';
import MovieContent from '../MovieContent/MovieContent';
import MovieFooter from '../MovieFooter/MovieFooter';

import './App.css';

export default function App() {
   const [getGuestSessionId, getGenres] = networkStore((state) => [state.getGuestSessionId, state.getGenres]);

   useEffect(() => {
      getGuestSessionId();
      getGenres();
   }, [getGuestSessionId, getGenres]);

   return (
      <Layout className="LayoutStyle">
         <MovieHeader />
         <MovieContent />
         <MovieFooter />
      </Layout>
   );
}
