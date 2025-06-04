import { Box, Flex, Button, Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <Box bg="white" shadow="sm" py={4}>
      <Flex maxW="container.xl" mx="auto" px={4} align="center" justify="space-between">
        <Flex align="center" gap={8}>
          <RouterLink to="/">
            <Box fontSize="2xl" fontWeight="bold" color="brand.600">
              WeebRaphael
            </Box>
          </RouterLink>

          {isAuthenticated && (
            <Flex gap={4}>
              <Button as={RouterLink} to="/recommendations" variant="ghost">
                Recommendations
              </Button>
              <Button as={RouterLink} to="/favorites" variant="ghost">
                Favorites
              </Button>
              <Button as={RouterLink} to="/watched" variant="ghost">
                Watched
              </Button>
            </Flex>
          )}
        </Flex>

        <Box>
          {isAuthenticated ? (
            <Menu>
              <MenuButton as={Button} variant="ghost">
                <Avatar size="sm" name={user?.name} />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Flex gap={4}>
              <Button as={RouterLink} to="/login" variant="ghost">
                Login
              </Button>
              <Button as={RouterLink} to="/register" variant="solid">
                Register
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}