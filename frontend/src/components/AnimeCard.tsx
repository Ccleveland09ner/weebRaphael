import React, { useState } from 'react';
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { FiHeart, FiEye, FiStar, FiImage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { anime } from '../services/api';
import config from '../config';

interface AnimeCardProps {
  id: number;
  title: string;
  imageUrl?: string;
  rating?: number;
  isFavorite?: boolean;
  isWatched?: boolean;
  onFavoriteToggle?: () => void;
  onWatchedToggle?: () => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  id,
  title,
  imageUrl,
  rating,
  isFavorite,
  isWatched,
  onFavoriteToggle,
  onWatchedToggle,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      if (isFavorite) {
        await anime.removeFavorite(id);
      } else {
        await anime.addFavorite({ anime_id: id, title });
      }
      onFavoriteToggle?.();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleWatched = async () => {
    if (!isAuthenticated) return;
    try {
      if (isWatched) {
        await anime.removeWatched(id);
      } else {
        await anime.addWatched({ anime_id: id, title, rating: 0 });
      }
      onWatchedToggle?.();
    } catch (error) {
      console.error('Error toggling watched:', error);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const finalImageUrl = imageUrl || `${config.animeImageUrl}/${id}.jpg`;

  return (
    <>
      <Box
        position="relative"
        borderRadius="lg"
        overflow="hidden"
        transition="transform 0.2s"
        _hover={{ transform: 'scale(1.05)' }}
        cursor="pointer"
        onClick={onOpen}
        bg="brand.grey"
      >
        {isImageLoading && (
          <Center h="300px">
            <Spinner color="brand.green" size="xl" />
          </Center>
        )}
        {!imageError ? (
          <Image
            src={finalImageUrl}
            alt={title}
            w="100%"
            h="300px"
            objectFit="cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            display={isImageLoading ? 'none' : 'block'}
          />
        ) : (
          <Center h="300px" bg="brand.blue">
            <VStack spacing={4}>
              <FiImage size={48} color="white" />
              <Text color="white" textAlign="center" px={4}>
                {title}
              </Text>
            </VStack>
          </Center>
        )}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="linear-gradient(transparent, rgba(0,0,0,0.8))"
          p={4}
        >
          <Text color="white" fontWeight="bold" noOfLines={2}>
            {title}
          </Text>
          {rating && (
            <HStack spacing={1}>
              <FiStar color="yellow" />
              <Text color="white">{rating.toFixed(1)}</Text>
            </HStack>
          )}
        </Box>
        {isAuthenticated && (
          <HStack
            position="absolute"
            top={2}
            right={2}
            spacing={2}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              aria-label="Add to favorites"
              icon={<FiHeart />}
              colorScheme={isFavorite ? 'red' : 'white'}
              variant="ghost"
              onClick={handleFavorite}
            />
            <IconButton
              aria-label="Mark as watched"
              icon={<FiEye />}
              colorScheme={isWatched ? 'green' : 'white'}
              variant="ghost"
              onClick={handleWatched}
            />
          </HStack>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="brand.grey">
          <ModalHeader color="brand.white">{title}</ModalHeader>
          <ModalCloseButton color="brand.white" />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {!imageError ? (
                <Image
                  src={finalImageUrl}
                  alt={title}
                  borderRadius="md"
                  maxH="400px"
                  objectFit="cover"
                  onError={handleImageError}
                />
              ) : (
                <Center h="400px" bg="brand.blue" borderRadius="md">
                  <VStack spacing={4}>
                    <FiImage size={64} color="white" />
                    <Text color="white" fontSize="xl" textAlign="center" px={4}>
                      {title}
                    </Text>
                  </VStack>
                </Center>
              )}
              <Text color="brand.white">
                {/* Add more anime details here */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
              {isAuthenticated && (
                <HStack spacing={4}>
                  <Button
                    leftIcon={<FiHeart />}
                    colorScheme={isFavorite ? 'red' : 'white'}
                    variant={isFavorite ? 'solid' : 'outline'}
                    onClick={handleFavorite}
                  >
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  <Button
                    leftIcon={<FiEye />}
                    colorScheme={isWatched ? 'green' : 'white'}
                    variant={isWatched ? 'solid' : 'outline'}
                    onClick={handleWatched}
                  >
                    {isWatched ? 'Remove from Watched' : 'Mark as Watched'}
                  </Button>
                </HStack>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AnimeCard; 