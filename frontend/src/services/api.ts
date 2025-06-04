// Add this to the existing api.ts file, after the animeService

export const adminService = {
  searchUsers: async (query: string, page: number = 1, pageSize: number = 10) => {
    const { data } = await api.get('/admin/users', {
      params: { query, page, page_size: pageSize }
    });
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  deleteUser: async (userId: string) => {
    await api.delete(`/admin/users/${userId}`);
  }
};