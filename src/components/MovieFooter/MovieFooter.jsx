import { Layout, Pagination } from 'antd';

import { networkStore, stateStore } from '../../data/stores/useMovieStore';

import './MovieFooter.css';

export default function MovieFooter() {
   const { Footer } = Layout;
   const [getMovies, getRatedMovies, totalResults] = networkStore((state) => [
      state.getMovies,
      state.getRatedMovies,
      state.totalResults,
   ]);
   const [inputValue, currentPage, setCurrentPage, currentRatedPage, setCurrentRatedPage, headerCurrentTab] =
      stateStore((state) => [
         state.inputValue,
         state.currentPage,
         state.setCurrentPage,
         state.currentRatedPage,
         state.setCurrentRatedPage,
         state.headerCurrentTab,
      ]);

   const handlePageChange = (current) => {
      if (headerCurrentTab === '1') {
         setCurrentPage(current);
         getMovies(inputValue, current);
      }
      if (headerCurrentTab === '2') {
         setCurrentRatedPage(current);
         getRatedMovies(current);
      }
   };

   return (
      <Footer className="footer">
         <Pagination
            current={headerCurrentTab === '1' ? currentPage : currentRatedPage}
            defaultPageSize={20}
            total={totalResults}
            showSizeChanger={false}
            hideOnSinglePage
            responsive
            onChange={handlePageChange}
         />
      </Footer>
   );
}
