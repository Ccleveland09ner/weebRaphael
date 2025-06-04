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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RegisterCredentials } from '../types/auth';

export function Register() {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('brand.black', 'brand.grey');
  const cardBgColor = useColorModeValue('brand.grey', 'brand.blue');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (credentials.password !== credentials.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      await register(credentials);
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to register',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
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
              Register
            </Heading>
            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                <FormControl isRequired>
                  <FormLabel color="brand.white">Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    bg="white"
                    color="black"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="brand.white">Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    bg="white"
                    color="black"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="brand.white">Confirm Password</FormLabel>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={credentials.confirmPassword}
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
                  Register
                </Button>
              </Stack>
            </form>
            <Text color="brand.white" textAlign="center">
              Already have an account?{' '}
              <RouterLink to="/login" style={{ color: '#4299E1' }}>
                Login
              </RouterLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Register; 