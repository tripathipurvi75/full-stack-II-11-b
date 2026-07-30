import { useState } from 'react';
import { Paper, Typography, Box, Button, Select, MenuItem, FormControl } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectPosts } from '../redux/selectors';
import DraftCard from './DraftCard';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import AllInboxIcon from '@mui/icons-material/AllInbox';

const FILTERS = ['All', 'Twitter', 'Instagram', 'LinkedIn', 'Facebook'];

const platformIcons = {
  All: <AllInboxIcon fontSize="small" />,
  Twitter: <TwitterIcon fontSize="small" />,
  Instagram: <InstagramIcon fontSize="small" />,
  LinkedIn: <LinkedInIcon fontSize="small" />,
  Facebook: <FacebookIcon fontSize="small" />,
};

// render the list of saved drafts, or an empty state, with platform-specific filters.
function SavedDrafts() {
  const posts = useSelector(selectPosts);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredPosts = posts.filter(
    (post) => selectedFilter === 'All' || post.platform === selectedFilter
  );

  const getCount = (platform) => {
    if (platform === 'All') return posts.length;
    return posts.filter((post) => post.platform === platform).length;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Saved Drafts
        </Typography>

        {posts.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 155 }}>
            <Select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.75,
                },
              }}
            >
              {FILTERS.map((platform) => {
                const count = getCount(platform);
                return (
                  <MenuItem key={platform} value={platform}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {platformIcons[platform]}
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {platform} ({count})
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </Box>

      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
            No drafts available.
          </Typography>
        </Box>
      ) : filteredPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" sx={{ color: '#9e9e9e', mb: 2 }}>
            No drafts available for {selectedFilter}.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedFilter('All')}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            Show All Drafts
          </Button>
        </Box>
      ) : (
        filteredPosts.map((post) => <DraftCard key={post.id} post={post} />)
      )}
    </Paper>
  );
}

export default SavedDrafts;

