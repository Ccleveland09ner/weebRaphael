import React from 'react';
import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiMenu, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export const Navigation: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const bgColor = useColorModeValue('brand.blue', 'brand.grey');

  return (
    <Box bg={bgColor} px={4} position="fixed" w="100%" zIndex={1000}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Text
            as={RouterLink}
            to="/"
            fontSize="2xl"
            fontWeight="bold"
            color="brand.white"
            _hover={{ textDecoration: 'none', color: 'brand.green' }}
          >
            WeebRaphael
          </Text>
        </Flex>

        {isAuthenticated ? (
          <Flex alignItems="center" gap={4}>
            <Button
              as={RouterLink}
              to="/favorites"
              variant="ghost"
              color="brand.white"
              _hover={{ bg: 'brand.green' }}
            >
              Favorites
            </Button>
            <Button
              as={RouterLink}
              to="/watched"
              variant="ghost"
              color="brand.white"
              _hover={{ bg: 'brand.green' }}
            >
              Watched
            </Button>
            <Button
              as={RouterLink}
              to="/recommendations"
              variant="ghost"
              color="brand.white"
              _hover={{ bg: 'brand.green' }}
            >
              Recommendations
            </Button>
            {isAdmin && (
              <Button
                as={RouterLink}
                to="/admin"
                variant="ghost"
                color="brand.white"
                _hover={{ bg: 'brand.green' }}
              >
                Admin
              </Button>
            )}
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiUser />}
                variant="ghost"
                color="brand.white"
                _hover={{ bg: 'brand.green' }}
              />
              <MenuList bg="brand.grey">
                <MenuItem
                  as={RouterLink}
                  to="/profile"
                  _hover={{ bg: 'brand.blue' }}
                  color="brand.white"
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={logout}
                  _hover={{ bg: 'brand.blue' }}
                  color="brand.white"
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          <Flex alignItems="center" gap={4}>
            <Button
              as={RouterLink}
              to="/login"
              variant="outline"
              color="brand.white"
              _hover={{ bg: 'brand.green' }}
            >
              Login
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              variant="solid"
              bg="brand.green"
              color="brand.white"
              _hover={{ bg: 'brand.blue' }}
            >
              Register
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}; 