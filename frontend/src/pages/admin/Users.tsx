import { Container, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Input, VStack, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/api';

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', searchQuery, page],
    queryFn: () => adminService.searchUsers(searchQuery, page, pageSize)
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Manage Users</Heading>

        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Age</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.age}</Td>
                <Td>{user.is_active ? 'Active' : 'Inactive'}</Td>
                <Td>
                  <Button size="sm" colorScheme="red">
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <HStack justify="center" spacing={4}>
          <Button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            isDisabled={page === 1}
          >
            Previous
          </Button>
          <Text>Page {page}</Text>
          <Button
            onClick={() => setPage(p => p + 1)}
            isDisabled={!data?.hasMore}
          >
            Next
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}