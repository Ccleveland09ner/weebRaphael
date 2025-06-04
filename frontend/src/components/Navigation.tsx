import { Box, Flex, Button, Menu, MenuButton, MenuList, MenuItem, Avatar, Container } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <Box bg="white" shadow="md" position="sticky" top="0" zIndex="sticky">
      <Container maxW="container.xl" py={4}>
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={8}>
            <RouterLink to="/">
              <Box fontSize="2xl" fontWeight="bold" color="brand.500">
                WeebRaphael
              </Box>
            </RouterLink>

            {isAuthenticated && (
              <Flex gap={6}>
                <Button as={RouterLink} to="/recommendations" variant="ghost" px={4}>
                  Recommendations
                </Button>
                <Button as={RouterLink} to="/favorites" variant="ghost" px={4}>
                  Favorites
                </Button>
                <Button as={RouterLink} to="/watched" variant="ghost" px={4}>
                  Watched
                </Button>
              </Flex>
            )}
          </Flex>

          <Box>
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Avatar size="sm" name={user?.name} bg="brand.500" />
                </MenuButton>
                <MenuList shadow="lg" border="none" overflow="hidden">
                  <MenuItem as={RouterLink} to="/profile" _hover={{ bg: 'gray.50' }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={logout} _hover={{ bg: 'gray.50' }}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Flex gap={4}>
                <Button as={RouterLink} to="/login" variant="ghost">
                  Login
                </Button>
                <Button as={RouterLink} to="/register" colorScheme="brand">
                  Register
                </Button>
              </Flex>
            )}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}