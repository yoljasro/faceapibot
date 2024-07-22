import React from 'react';
import { Box } from '@admin-bro/design-system';

const ImageListComponent = (props) => {
  const { record } = props;
  const images = record.params.images || [];

  return (
    <Box>
      {images.map((image, index) => (
        <Box key={index} mt="default">
          <img src={`http://localhost:4000/${image}`} alt={`Image ${index + 1}`} style={{ width: '100px', height: '100px' }} />
        </Box>
      ))}
    </Box>
  );
};

export default ImageListComponent;
