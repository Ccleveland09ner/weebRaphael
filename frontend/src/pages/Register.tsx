import { Box, Container, Heading, VStack, FormControl, FormLabel, Input, Button, Text, Link, Flex, useColorModeValue, NumberInput, NumberInputField } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.age || parseInt(formData.age) < 13) {
      setError('You must be at least 13 years old to register');
      return;
    }

    setIsLoading(true);

    try {
      await auth.register({
        ...formData,
        age: parseInt(formData.age)
      });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            Join WeebRaphael
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

        {/* Background gradient */}
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

      {/* Right side - Register Form */}
      <Box flex="1" p={8} display="flex" alignItems="center">
        <Container maxW="md">
          <Box bg="white" p={8} borderRadius="xl" shadow="xl" w="full">
            <VStack spacing={8}>
              <VStack spacing={2} textAlign="center" w="full">
                <Heading color="brand.500">Create Account</Heading>
                <Text color="gray.600">
                  Join our community of anime enthusiasts
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
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
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

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
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

                  <FormControl isRequired>
                    <FormLabel>Age</FormLabel>
                    <Input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="13"
                      max="120"
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

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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

                  <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
                    Create Account
                  </Button>
                </VStack>
              </Box>

              <Text>
                Already have an account?{' '}
                <Link
                  as={RouterLink}
                  to="/login"
                  color="brand.500"
                  fontWeight="semibold"
                  _hover={{
                    textDecoration: 'none',
                    color: 'brand.600',
                  }}
                >
                  Sign In
                </Link>
              </Text>
            </VStack>
          </Box>
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