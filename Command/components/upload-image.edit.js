// upload-image.edit.js
import React from 'react';
import { Label, Box, DropZone, BasePropertyProps, DropZoneProps, DropZoneItem } from 'admin-bro';

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { property, onChange, record } = props;

  const handleDropZoneChange: DropZoneProps['onChange'] = (files) => {
    onChange(property.name, files[0]);
  };

  const uploadedPhoto = record.params.image; // Bu qismni yangi modelingizga mos ravishda o'zgartiring

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label> 
      <DropZone onChange={handleDropZoneChange}/>
      {uploadedPhoto && (
        <DropZoneItem src={uploadedPhoto} />
      )}
    </Box>
  );
};

export default Edit;