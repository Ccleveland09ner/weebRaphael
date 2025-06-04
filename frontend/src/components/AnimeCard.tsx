import { Box, Image, Text, VStack, HStack, IconButton, Badge, Flex } from '@chakra-ui/react';
import { FiHeart, FiEye, FiStar } from 'react-icons/fi';
import { Anime } from '../types/anime';
import { animeService } from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

interface AnimeCardProps {
  anime: Anime;
  isFavorite?: boolean;
  isWatched?: boolean;
  showActions?: boolean;
}

export default function AnimeCard({ anime, isFavorite, isWatched, showActions = true }: AnimeCardProps) {
  const queryClient = useQueryClient();

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await animeService.removeFavorite(anime.id);
      } else {
        await animeService.addFavorite(anime.id);
      }
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    } catch (error) {
      console.error('Failed to update favorites:', error);
    }
  };

  const handleWatched = async () => {
    try {
      if (isWatched) {
        await animeService.removeWatched(anime.id);
      } else {
        await animeService.addWatched(anime.id);
      }
      queryClient.invalidateQueries({ queryKey: ['watched'] });
    } catch (error) {
      console.error('Failed to update watched:', error);
    }
  };

  return (
    <Box
      position="relative"
      borderRadius="xl"
      overflow="hidden"
      bg="white"
      shadow="lg"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'xl',
      }}
    >
      <Box position="relative">
        <Image
          src={anime.coverImage}
          alt={anime.title}
          objectFit="cover"
          w="100%"
          h="250px"
        />
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          bg="linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)"
          p={4}
        >
          <Text color="white" fontWeight="bold" fontSize="lg" noOfLines={2}>
            {anime.title}
          </Text>
        </Box>
      </Box>
      
      <VStack p={4} align="stretch" spacing={3}>
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {anime.description}
        </Text>
        
        <Flex wrap="wrap" gap={2}>
          <HStack bg="gray.100" px={2} py={1} rounded="md">
            <FiStar color="gold" />
            <Text fontSize="sm" fontWeight="medium">
              {anime.rating.toFixed(1)}
            </Text>
          </HStack>
          
          {anime.genres.map((genre) => (
            <Badge
              key={genre}
              colorScheme="brand"
              px={2}
              py={1}
              rounded="md"
              fontSize="xs"
            >
              {genre}
            </Badge>
          ))}
        </Flex>
        
        {showActions && (
          <HStack justify="flex-end" spacing={2} pt={2}>
            <IconButton
              aria-label="Add to favorites"
              icon={<FiHeart />}
              colorScheme={isFavorite ? 'red' : 'gray'}
              variant="ghost"
              onClick={handleFavorite}
              size="lg"
            />
            <IconButton
              aria-label="Mark as watched"
              icon={<FiEye />}
              colorScheme={isWatched ? 'green' : 'gray'}
              variant="ghost"
              onClick={handleWatched}
              size="lg"
            />
          </HStack>
        )}
      </VStack>
    </Box>
  );
}