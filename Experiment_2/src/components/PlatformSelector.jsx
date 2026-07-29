import { Box, Typography, Select, MenuItem, FormControl } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setPlatform } from '../redux/postsSlice';
import { selectPlatform } from '../redux/selectors';

const PLATFORMS = ['Twitter', 'Instagram', 'LinkedIn', 'Facebook'];

//  let the user choose which platform they're composing for.
function PlatformSelector() {
  const dispatch = useDispatch();
  const platform = useSelector(selectPlatform);

  const handleChange = (event) => {
    dispatch(setPlatform(event.target.value));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
        Select Platform
      </Typography>
      <FormControl fullWidth size="small">
        <Select value={platform} onChange={handleChange}>
          {PLATFORMS.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default PlatformSelector;
