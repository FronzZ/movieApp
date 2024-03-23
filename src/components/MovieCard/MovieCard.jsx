import { Typography, Tag, Flex, Rate } from 'antd';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

import { networkStore } from '../../data/stores/useMovieStore';
import './MovieCard.css';

export default function MovieCard({ id, title, description, releaseDate, poster, raiting, userRaiting, genres }) {
   const addRaiting = networkStore((state) => state.addRaiting);
   const [userRate, setUserRate] = useState(userRaiting);

   let voteColor = '';
   if (raiting <= 3) voteColor = '#E90000';
   if (raiting > 3 && raiting <= 5) voteColor = '#E97E00';
   if (raiting > 5 && raiting <= 7) voteColor = '#E9D100';
   if (raiting > 7) voteColor = '#66E900';

   return (
      <li className="card">
         <div className="card__image">
            <img className="card__image-photo" src={poster} alt="poster" />
         </div>
         <div className="card__details">
            <div className="card__details-header">
               <Typography.Title level={5} style={{ margin: '0 0 5px 0px' }}>
                  {title}
               </Typography.Title>
               <div className="card__details-raiting" style={{ border: `2px solid ${voteColor}` }}>
                  {raiting}
               </div>
            </div>
            <Typography.Text
               type="secondary"
               style={{
                  fontSize: '12px',
                  display: 'inline-block',
                  marginBottom: '5px',
               }}
            >
               {releaseDate}
            </Typography.Text>
            <Flex gap="small" wrap="wrap">
               {genres && genres.length > 0 ? (
                  genres.map((el) => (
                     <Tag key={uuidv4()} style={{ padding: '0 3px' }}>
                        {el}
                     </Tag>
                  ))
               ) : (
                  <Tag style={{ padding: '0 3px' }}>No genres available</Tag>
               )}
            </Flex>
         </div>
         <div className="card__description">
            <Typography.Paragraph style={{ margin: 0 }}>{description}</Typography.Paragraph>
            <Rate
               className="card__description-add-raiting"
               count={10}
               allowHalf
               value={userRate}
               onChange={(value) => {
                  setUserRate(value);
                  addRaiting(id, value);
               }}
            />
         </div>
      </li>
   );
}

MovieCard.propTypes = {
   id: PropTypes.number.isRequired,
   title: PropTypes.string.isRequired,
   description: PropTypes.string.isRequired,
   releaseDate: PropTypes.string.isRequired,
   poster: PropTypes.string.isRequired,
   raiting: PropTypes.number.isRequired,
   userRaiting: PropTypes.number.isRequired,
   genres: PropTypes.arrayOf(PropTypes.string).isRequired,
};
