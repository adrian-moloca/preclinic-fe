import React, { useRef } from 'react';
import { Avatar, IconButton, Box } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { ProfileImageUploaderWrapper } from './style';

interface ProfileImageUploaderProps {
  image: string | null;
  setImage: (img: string) => void;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ image, setImage }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ProfileImageUploaderWrapper>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={image || undefined}
          sx={{ width: 100, height: 100, border: '2px solid #1976d2' }}
        />
        <IconButton
          onClick={handleImageClick}
          sx={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            backgroundColor: '#fff',
            boxShadow: 1,
            '&:hover': { backgroundColor: '#eee' },
          }}
        >
          <EditIcon color="primary" />
        </IconButton>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </Box>
    </ProfileImageUploaderWrapper>
  );
};
