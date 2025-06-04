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
import type { LoginCredentials } from '../types/auth';

export function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('brand.black', 'brand.grey');
  const cardBgColor = useColorModeValue('brand.grey', 'brand.blue');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(credentials);
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials',
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
              Login
            </Heading>
            <form onSubmit={handleSubmit}>
              <Stack gap={4}>
                <FormControl isRequired>
                  <FormLabel color="brand.white">Email</FormLabel>
                  <Input
                    type="email"
                    name="username"
                    value={credentials.username}
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
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Login
                </Button>
              </Stack>
            </form>
            <Text color="brand.white" textAlign="center">
              Don't have an account?{' '}
              <RouterLink to="/register" style={{ color: '#4299E1' }}>
                Register
              </RouterLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Login; 