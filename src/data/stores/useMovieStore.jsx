import { create } from 'zustand';
import { format } from 'date-fns';
import axios from 'axios';

import noPosterImage from '../../images/no-poster.jpeg';

export const networkStore = create((set, get) => ({
   movies: [],
   userRaitingMap: new Map(),
   genresMap: new Map(),
   apiBase: 'https://api.themoviedb.org/3',
   apiKey: '52a65a0eecf99d9a7d9c108b167dd5e6',
   guestSessionId: '',
   isError: false,
   isLoading: false,
   noResults: false,
   totalResults: 0,

   getGenres: async () => {
      const { apiBase, apiKey } = get();
      try {
         const response = await axios.get(`${apiBase}/genre/movie/list`, {
            params: {
               api_key: apiKey,
            },
         });
         const genresMap = new Map(response.data.genres.map((el) => [el.id, el.name]));

         set({ genresMap });
      } catch (error) {
         // console.error('Genres error', error);
         set({ isError: true });
      }
   },

   getMovies: async (text, page) => {
      const { apiBase, apiKey, genresMap, userRaitingMap } = get();

      set({ isLoading: true });

      try {
         const response = await axios.get(`${apiBase}/search/movie`, {
            params: {
               query: text,
               page,
               api_key: apiKey,
            },
         });

         const formattedMovies = response.data.results.map((movie) => ({
            ...movie,

            release_date: movie.release_date ? format(new Date(movie.release_date), 'MMMM dd, yyyy') : 'unknown',

            overview:
               movie.overview && movie.overview.length > 150
                  ? `${movie.overview.slice(0, movie.overview.lastIndexOf(' ', 150))}...`
                  : movie.overview || 'No description available',

            poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : noPosterImage,

            genre_ids: movie.genre_ids ? movie.genre_ids.map((genreId) => genresMap.get(genreId)) : [],

            vote_average: Math.floor(movie.vote_average * 10) / 10,

            rating: userRaitingMap.get(movie.id) || 0,
         }));

         const noResults = formattedMovies.length === 0;

         set({
            movies: formattedMovies,
            isLoading: false,
            isError: false,
            totalResults: response.data.total_results,
            noResults,
         });
      } catch (error) {
         // console.error(`Ошибка получения фильмов: ${error}`);
         set({ movies: [], isError: true, isLoading: false });
      }
   },

   getRatedMovies: async (page) => {
      const { apiBase, apiKey, guestSessionId, genresMap } = get();

      set({ isLoading: true });

      try {
         const response = await axios.get(`${apiBase}/guest_session/${guestSessionId}/rated/movies`, {
            params: {
               page,
               api_key: apiKey,
            },
         });

         const formattedMovies = response.data.results.map((movie) => ({
            ...movie,

            release_date: movie.release_date ? format(new Date(movie.release_date), 'MMMM dd, yyyy') : 'unknown',

            overview:
               movie.overview && movie.overview.length > 150
                  ? `${movie.overview.slice(0, movie.overview.lastIndexOf(' ', 150))}...`
                  : movie.overview || 'No description available',

            poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : noPosterImage,

            genre_ids: movie.genre_ids ? movie.genre_ids.map((genreId) => genresMap.get(genreId)) : [],

            vote_average: Math.floor(movie.vote_average * 10) / 10,
         }));

         set({
            movies: formattedMovies,
            isLoading: false,
            isError: false,
            totalResults: response.data.total_results,
            noResults: false,
         });
      } catch (error) {
         if (error.response.status === 404) {
            set({ noResults: true, isLoading: false });
            return;
         }
         // console.error(`Ошибка получения понравившихся фильмов: ${error}`);
         set({ movies: [], isError: true, isLoading: false });
      }
   },

   getGuestSessionId: async () => {
      const { apiBase, apiKey } = get();
      try {
         const response = await axios.get(`${apiBase}/authentication/guest_session/new`, {
            params: {
               api_key: apiKey,
            },
         });

         set({ guestSessionId: response.data.guest_session_id });
      } catch (e) {
         // console.error('Ошибка при создании гостевой сессии', e);
         set({ isError: true });
      }
   },

   addRaiting: async (movieId, value) => {
      const { apiBase, apiKey, guestSessionId, userRaitingMap } = get();
      try {
         await axios.post(
            `${apiBase}/movie/${movieId}/rating`,
            { value },
            {
               params: {
                  api_key: apiKey,
                  guest_session_id: guestSessionId,
               },
            },
         );

         userRaitingMap.set(movieId, value);
      } catch (e) {
         // console.error('Ошибка добавления понравившегося фильма', e.message);
         set({ isError: true });
      }
   },

   setNoResults: (boolean) => set({ noResults: boolean }),
}));

export const stateStore = create((set) => ({
   inputValue: '',
   currentPage: 1,
   currentRatedPage: 1,
   headerCurrentTab: '1',

   setInputValue: (value) => set({ inputValue: value }),

   setCurrentPage: (page) => set({ currentPage: page }),

   setCurrentRatedPage: (page) => set({ currentRatedPage: page }),

   setHeaderCurrentTab: (tab) => set({ headerCurrentTab: tab }),
}));
