import { Container, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { animeService } from '../services/api';
import AnimeCard from '../components/AnimeCard';

export default function Favorites() {
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => animeService.getFavorites()
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Your Favorites</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {favorites?.map((anime) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              isFavorite={true}
            />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}