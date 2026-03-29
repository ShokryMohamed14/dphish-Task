import type { User } from '../types/table';

export const generateMockUsers = (count: number): User[] => {
  const roles = ['Admin', 'Editor', 'Viewer', 'Contributor', 'Manager'];
  const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];
  const data: User[] = [];
  
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joined: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
      score: Math.floor(Math.random() * 100),
    });
  }
  return data;
};
