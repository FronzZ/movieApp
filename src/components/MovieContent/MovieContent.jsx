import { Layout } from 'antd';

import MovieList from '../MovieList/MovieList';

export default function MovieContent() {
   const { Content } = Layout;
   return (
      <Content>
         <MovieList />
      </Content>
   );
}
