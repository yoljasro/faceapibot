// components/ImageShowComponent.jsx
import React from 'react';
import { BasePropertyProps } from 'admin-bro';

const ImageShowComponent: React.FC<BasePropertyProps> = (props) => {
  const { record } = props;
  const srcImg = record.params.image; // Adjust if necessary

  return (
    <div>
      {srcImg ? (
        <img src={srcImg} width="100px" alt="User Image" />
      ) : 'No image available'}
    </div>
  );
};

export default ImageShowComponent;
