import { Box, Image, Text, VStack, HStack, IconButton, Badge } from '@chakra-ui/react';
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
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)' }}
    >
      <Image
        src={anime.coverImage}
        alt={anime.title}
        objectFit="cover"
        w="100%"
        h="200px"
      />
      
      <VStack p={4} align="stretch" spacing={2}>
        <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
          {anime.title}
        </Text>
        
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {anime.description}
        </Text>
        
        <HStack spacing={2}>
          <HStack>
            <FiStar />
            <Text>{anime.rating.toFixed(1)}</Text>
          </HStack>
          
          {anime.genres.map((genre) => (
            <Badge key={genre} colorScheme="blue">
              {genre}
            </Badge>
          ))}
        </HStack>
        
        {showActions && (
          <HStack justify="flex-end" spacing={2}>
            <IconButton
              aria-label="Add to favorites"
              icon={<FiHeart />}
              colorScheme={isFavorite ? 'red' : 'gray'}
              variant="ghost"
              onClick={handleFavorite}
            />
            <IconButton
              aria-label="Mark as watched"
              icon={<FiEye />}
              colorScheme={isWatched ? 'green' : 'gray'}
              variant="ghost"
              onClick={handleWatched}
            />
          </HStack>
        )}
      </VStack>
    </Box>
  );
}