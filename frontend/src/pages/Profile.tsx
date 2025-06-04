import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserUpdate } from '../types/auth';

export function Profile() {
  const [formData, setFormData] = useState<UserUpdate>({
    email: '',
    currentPassword: '',
    newPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('brand.black', 'brand.grey');
  const cardBgColor = useColorModeValue('brand.grey', 'brand.blue');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateUser(formData);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete account',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box minH="100vh" bg={bgColor} pt={20}>
      <Container maxW="container.sm">
        <Box
          bg={cardBgColor}
          p={8}
          borderRadius="xl"
          boxShadow="xl"
        >
          <Stack gap={6}>
            <Heading color="brand.white" textAlign="center">
              Profile Settings
            </Heading>
            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                <FormControl>
                  <FormLabel color="brand.white">Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={user?.email}
                    bg="white"
                    color="black"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="brand.white">Current Password</FormLabel>
                  <Input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    bg="white"
                    color="black"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="brand.white">New Password</FormLabel>
                  <Input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    bg="white"
                    color="black"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Update Profile
                </Button>
              </Stack>
            </form>
            <Button
              colorScheme="red"
              size="lg"
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Profile; 