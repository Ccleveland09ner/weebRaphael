import { Container, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Box, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/api';

export default function AdminStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getStats()
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>System Statistics</Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>{stats?.total_users}</StatNumber>
            </Stat>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Stat>
              <StatLabel>Active Users</StatLabel>
              <StatNumber>{stats?.active_users}</StatNumber>
              <StatHelpText>
                {((stats?.active_users / stats?.total_users) * 100).toFixed(1)}% of total
              </StatHelpText>
            </Stat>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Stat>
              <StatLabel>Average Age</StatLabel>
              <StatNumber>{stats?.average_age.toFixed(1)}</StatNumber>
            </Stat>
          </Box>

          <Box bg="white" p={6} borderRadius="lg" shadow="sm">
            <Stat>
              <StatLabel>Total Recommendations</StatLabel>
              <StatNumber>{stats?.total_recommendations}</StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}