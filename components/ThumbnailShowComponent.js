import React from 'react';
import PropTypes from 'prop-types';

const ThumbnailShowComponent = (props) => {
  const { record, property } = props;
  const imageUrl = record.params[property.name]; // Assuming the property name matches the image field

  return (
    <div style={{ textAlign: 'center' }}>
      {imageUrl && (
        <div>
          <img src={`/uploads/${imageUrl}`} alt="full view" style={{ maxWidth: '100%', maxHeight: '500px' }} />
          <br />
          <a href={`/uploads/${imageUrl}`} target="_blank" rel="noopener noreferrer">View Full Image</a>
        </div>
      )}
    </div>
  );
};

ThumbnailShowComponent.propTypes = {
  record: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
};

export default ThumbnailShowComponent;
