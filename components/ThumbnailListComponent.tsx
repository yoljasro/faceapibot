import React from 'react';

const ThumbnailListComponent = (props) => {
  return <img src={props.record.params.image} style={{ width: '100px', height: '100px' }} alt="Thumbnail" />;
};

export default ThumbnailListComponent;
