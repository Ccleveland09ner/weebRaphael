import { Box, Stack, Select, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb, Text } from '@chakra-ui/react';
import { AnimeFilter } from '../types/anime';

interface AnimeFiltersProps {
  filters: AnimeFilter;
  onFilterChange: (filters: AnimeFilter) => void;
}

export default function AnimeFilters({ filters, onFilterChange }: AnimeFiltersProps) {
  const genres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life'
  ];

  return (
    <Stack spacing={4} p={4} bg="white" borderRadius="lg" shadow="sm">
      <Box>
        <Text mb={2}>Genre</Text>
        <Select
          value={filters.genre || ''}
          onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </Select>
      </Box>

      <Box>
        <Text mb={2}>Rating</Text>
        <RangeSlider
          defaultValue={[0, 10]}
          min={0}
          max={10}
          step={0.5}
          onChange={(values) => onFilterChange({ ...filters, rating: values[1] })}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      </Box>

      <Box>
        <Text mb={2}>Sort By</Text>
        <Select
          value={filters.sort || 'popularity'}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value as AnimeFilter['sort'] })}
        >
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
          <option value="title">Title</option>
          <option value="releaseDate">Release Date</option>
        </Select>
      </Box>

      <Box>
        <Text mb={2}>Order</Text>
        <Select
          value={filters.order || 'desc'}
          onChange={(e) => onFilterChange({ ...filters, order: e.target.value as AnimeFilter['order'] })}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </Select>
      </Box>
    </Stack>
  );
}