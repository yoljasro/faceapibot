// upload-image.list.tsx
import React from 'react';
import { Box, BasePropertyProps } from 'admin-bro';

const List: React.FC<BasePropertyProps> = (props) => {
  const { record } = props;

  const srcImg = record.params.image; // Bu qismni yangi modelingizga mos ravishda o'zgartiring

  return (
    <Box>
      {srcImg ? (
        <img src={srcImg} width="100px" />
      ) : 'no image'}
    </Box>
  );
};

export default List;