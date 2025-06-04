import { Box, Flex, Button, Menu, MenuButton, MenuList, MenuItem, Avatar, Container } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  // Don't show navigation on login/register pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <Box bg="white" shadow="md" position="sticky" top="0" zIndex="sticky">
      <Container maxW="container.xl" py={4}>
        <Flex align="center" justify="space-between">
          <Box fontSize="2xl" fontWeight="bold" color="brand.500">
            WeebRaphael
          </Box>

          {isAuthenticated && (
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
                <MenuItem as={RouterLink} to="/recommendations" _hover={{ bg: 'gray.50' }}>
                  Recommendations
                </MenuItem>
                <MenuItem as={RouterLink} to="/favorites" _hover={{ bg: 'gray.50' }}>
                  Favorites
                </MenuItem>
                <MenuItem as={RouterLink} to="/watched" _hover={{ bg: 'gray.50' }}>
                  Watched
                </MenuItem>
                <MenuItem as={RouterLink} to="/profile" _hover={{ bg: 'gray.50' }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={logout} _hover={{ bg: 'gray.50' }}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Container>
    </Box>
  );
}