import { Layout, Input, Tabs } from 'antd';
import { useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';

import { networkStore, stateStore } from '../../data/stores/useMovieStore';
import './MovieHeader.css';

export default function MovieHeader() {
   const { Header } = Layout;
   const [getMovies, setNoResults, getRatedMovies] = networkStore((state) => [
      state.getMovies,
      state.setNoResults,
      state.getRatedMovies,
   ]);
   const [
      inputValue,
      currentPage,
      currentRatedPage,
      headerCurrentTab,
      setInputValue,
      setCurrentPage,
      setHeaderCurrentTab,
   ] = stateStore((state) => [
      state.inputValue,
      state.currentPage,
      state.currentRatedPage,
      state.headerCurrentTab,
      state.setInputValue,
      state.setCurrentPage,
      state.setHeaderCurrentTab,
   ]);

   const tabItems = [
      {
         key: '1',
         label: 'Search',
      },
      {
         key: '2',
         label: 'Rated',
      },
   ];

   const debouncedGetMovies = useMemo(
      () =>
         debounce((value) => {
            getMovies(value);
         }, 500),
      [getMovies],
   );

   const handleInputChange = useCallback(
      (e) => {
         setInputValue(e.target.value);
         debouncedGetMovies(e.target.value);
         setCurrentPage(1);
         setNoResults(false);
      },
      [debouncedGetMovies, setInputValue, setCurrentPage, setNoResults],
   );

   const handleTabsChange = (tabsKey) => {
      setHeaderCurrentTab(tabsKey);

      if (tabsKey === '1') {
         getMovies(inputValue, currentPage);
      }
      if (tabsKey === '2') {
         getRatedMovies(currentRatedPage);
      }
   };

   return (
      <Header className="header">
         <Tabs destroyInactiveTabPane defaultActiveKey="1" items={tabItems} onChange={handleTabsChange} />
         {headerCurrentTab === '1' && (
            <Input placeholder="Type to search..." value={inputValue} onChange={handleInputChange} />
         )}
      </Header>
   );
}
