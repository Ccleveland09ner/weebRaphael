import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { AnimeStats } from '../types/anime';

interface UserStatsProps {
  stats: AnimeStats;
}

export default function UserStats({ stats }: UserStatsProps) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      <Box bg="white" p={6} borderRadius="lg" shadow="sm">
        <Stat>
          <StatLabel>Favorites</StatLabel>
          <StatNumber>{stats.favoritesCount}</StatNumber>
        </Stat>
      </Box>

      <Box bg="white" p={6} borderRadius="lg" shadow="sm">
        <Stat>
          <StatLabel>Watched</StatLabel>
          <StatNumber>{stats.watchedCount}</StatNumber>
          <StatHelpText>{stats.totalHoursWatched} hours</StatHelpText>
        </Stat>
      </Box>

      <Box bg="white" p={6} borderRadius="lg" shadow="sm">
        <Stat>
          <StatLabel>Average Rating</StatLabel>
          <StatNumber>{stats.averageRating.toFixed(1)}</StatNumber>
        </Stat>
      </Box>

      <Box bg="white" p={6} borderRadius="lg" shadow="sm">
        <Stat>
          <StatLabel>Top Genre</StatLabel>
          <StatNumber>{stats.topGenres[0] || 'N/A'}</StatNumber>
        </Stat>
      </Box>
    </SimpleGrid>
  );
}