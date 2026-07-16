import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { PLATFORM_LIMITS } from '../utils/platformLimits';

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 200
      }
    }
  }
};

const social_media = Object.keys(PLATFORM_LIMITS);

function SocialMediaSelect({ value, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, width: 200 }}>
      <InputLabel id="social-media-label">Select Platform</InputLabel>

      <Select
        labelId="social-media-label"
        id="social-media-select"
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label="Select Platform" />}
        MenuProps={MenuProps}
      >
        {social_media.map((platform) => (
          <MenuItem key={platform} value={platform}>
            {platform}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SocialMediaSelect;
