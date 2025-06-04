import { Box, Container, Heading, VStack, FormControl, FormLabel, Input, Button, Text, Link, Flex, Image } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Left side - Information */}
      <Box
        display={{ base: 'none', lg: 'flex' }}
        flex="1"
        bg="brand.500"
        color="white"
        p={12}
        flexDirection="column"
        justifyContent="center"
      >
        <Heading size="2xl" mb={6}>
          Welcome to WeebRaphael
        </Heading>
        <Text fontSize="xl" mb={8}>
          Your Personal Anime Discovery Platform
        </Text>
        <VStack spacing={6} align="flex-start">
          <Feature
            title="Smart Recommendations"
            description="Get personalized anime suggestions based on your preferences and viewing history"
          />
          <Feature
            title="Track Your Journey"
            description="Keep track of your watched anime and maintain your favorites list"
          />
          <Feature
            title="Community Insights"
            description="Discover what other anime enthusiasts are watching and loving"
          />
        </VStack>
        <Image
          src="https://images.pexels.com/photos/2832432/pexels-photo-2832432.jpeg"
          alt="Anime Illustration"
          mt={12}
          rounded="xl"
          opacity={0.9}
        />
      </Box>

      {/* Right side - Login Form */}
      <Box flex="1" p={8} display="flex" alignItems="center">
        <Container maxW="md">
          <VStack spacing={8} bg="white" p={8} borderRadius="xl" shadow="xl">
            <VStack spacing={2} textAlign="center" w="full">
              <Heading color="brand.500">Sign In</Heading>
              <Text color="gray.600">
                Welcome back! Please login to your account
              </Text>
            </VStack>

            {error && (
              <Text color="red.500" w="full" textAlign="center" bg="red.50" p={2} rounded="md">
                {error}
              </Text>
            )}

            <Box as="form" onSubmit={handleSubmit} w="full">
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', ring: 2, ringColor: 'brand.500' }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', ring: 2, ringColor: 'brand.500' }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
                >
                  Sign In
                </Button>
              </VStack>
            </Box>

            <Text>
              Don't have an account?{' '}
              <Link as={RouterLink} to="/register" color="brand.500" fontWeight="semibold">
                Sign Up
              </Link>
            </Text>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={1}>
        {title}
      </Text>
      <Text opacity={0.9}>
        {description}
      </Text>
    </Box>
  );
}