import React from 'react';
import PropTypes from 'prop-types';

const ThumbnailListComponent = (props) => {
  const { record, property } = props;
  const imageUrl = record.params[property.name]; // Assuming the property name matches the image field

  return (
    <div style={{ width: '200px', height: '150px', overflow: 'hidden' }}>
      {imageUrl && <img src={`/uploads/${imageUrl}`} alt="thumbnail" style={{ width: '100%', height: 'auto' }} />}
    </div>
  );
};

ThumbnailListComponent.propTypes = {
  record: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
};

export default ThumbnailListComponent;
