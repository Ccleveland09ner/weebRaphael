import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { user } from '../services/api';
import type { UserSearchResponse, UserStats } from '../types/user';

export function Admin() {
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const bgColor = useColorModeValue('brand.black', 'brand.grey');
  const cardBgColor = useColorModeValue('brand.grey', 'brand.blue');

  const { data: users, isLoading: isLoadingUsers } = useQuery<UserSearchResponse>({
    queryKey: ['users', searchQuery],
    queryFn: () => user.searchUsers(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery<UserStats>({
    queryKey: ['stats'],
    queryFn: () => user.getStats(),
  });

  return (
    <Box minH="100vh" bg={bgColor} pt={20}>
      <Container maxW="container.xl">
        <Heading color="brand.white" mb={6}>
          Admin Dashboard
        </Heading>

        {/* Stats Section */}
        <Box bg={cardBgColor} p={6} borderRadius="xl" mb={8}>
          <Heading size="md" color="brand.white" mb={4}>
            User Statistics
          </Heading>
          {isLoadingStats ? (
            <Text color="brand.white">Loading stats...</Text>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="brand.white">Total Users</Th>
                  <Th color="brand.white">Active Users</Th>
                  <Th color="brand.white">New Users (24h)</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td color="brand.white">{stats?.total_users || 0}</Td>
                  <Td color="brand.white">{stats?.active_users || 0}</Td>
                  <Td color="brand.white">{stats?.new_users_24h || 0}</Td>
                </Tr>
              </Tbody>
            </Table>
          )}
        </Box>

        {/* User Search Section */}
        <Box bg={cardBgColor} p={6} borderRadius="xl">
          <Heading size="md" color="brand.white" mb={4}>
            User Search
          </Heading>
          <Input
            placeholder="Search users by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
            color="black"
            mb={4}
          />
          {isLoadingUsers ? (
            <Text color="brand.white">Searching users...</Text>
          ) : users?.users.length === 0 ? (
            <Text color="brand.white">No users found</Text>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="brand.white">Email</Th>
                  <Th color="brand.white">Last Login</Th>
                  <Th color="brand.white">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users?.users.map((user) => (
                  <Tr key={user.id}>
                    <Td color="brand.white">{user.email}</Td>
                    <Td color="brand.white">
                      {new Date(user.last_login).toLocaleDateString()}
                    </Td>
                    <Td color="brand.white">{user.is_active ? 'Active' : 'Inactive'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Admin; 