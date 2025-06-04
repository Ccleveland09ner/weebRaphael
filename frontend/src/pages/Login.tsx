import { Box, Container, Heading, VStack, FormControl, FormLabel, Input, Button, Text, Link, Flex, Image, useColorModeValue } from '@chakra-ui/react';
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
    <Flex minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Left side - Information */}
      <Box
        display={{ base: 'none', lg: 'flex' }}
        flex="1"
        bg="brand.500"
        color="white"
        p={12}
        flexDirection="column"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        <Box position="relative" zIndex="1">
          <Heading size="2xl" mb={6}>
            Welcome to WeebRaphael
          </Heading>
          <Text fontSize="xl" mb={8} opacity={0.9}>
            Your Personal Anime Discovery Platform
          </Text>
          
          <VStack spacing={8} align="flex-start">
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
            <Feature
              title="Personalized Experience"
              description="Rate, review, and get recommendations tailored just for you"
            />
          </VStack>
        </Box>

        {/* Background pattern */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-br, brand.400, brand.600)"
          opacity="0.8"
          zIndex="0"
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
              <Text
                color="red.500"
                w="full"
                textAlign="center"
                bg="red.50"
                p={3}
                rounded="md"
                fontSize="sm"
              >
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
                    border="2px solid"
                    borderColor="transparent"
                    _focus={{
                      bg: 'white',
                      borderColor: 'brand.500',
                    }}
                    _hover={{
                      bg: 'gray.100',
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="gray.50"
                    border="2px solid"
                    borderColor="transparent"
                    _focus={{
                      bg: 'white',
                      borderColor: 'brand.500',
                    }}
                    _hover={{
                      bg: 'gray.100',
                    }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                >
                  Sign In
                </Button>
              </VStack>
            </Box>

            <Text>
              Don't have an account?{' '}
              <Link
                as={RouterLink}
                to="/register"
                color="brand.500"
                fontWeight="semibold"
                _hover={{
                  textDecoration: 'none',
                  color: 'brand.600',
                }}
              >
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
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        {title}
      </Text>
      <Text fontSize="md" opacity={0.9}>
        {description}
      </Text>
    </Box>
  );
}