import React from 'react';

const ThumbnailShowComponent = (props) => {
  return <img src={props.record.params.image} style={{ width: '100px', height: '100px' }} alt="Thumbnail" />;
};

export default ThumbnailShowComponent;
