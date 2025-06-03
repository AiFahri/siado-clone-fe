import { useState, useEffect, useCallback } from "react";
import { adminApi, handleApiError } from "@/Utils/api";
import { getGlobalUsers } from "@/Utils/globalStore";
import type { User } from "@/types";
import {type UserRole } from "@/Utils/constants";

interface UseUsersOptions {
  immediate?: boolean;
  role?: UserRole;
}

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createUser: (
    userData: Partial<User> & { password: string }
  ) => Promise<User | null>;
  updateUser: (id: number, userData: Partial<User>) => Promise<User | null>;
  deleteUser: (id: number) => Promise<boolean>;
  getUsersByRole: (role: UserRole) => User[];
}

interface UseUserDetailReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<User | null>;
  deleteUser: () => Promise<boolean>;
}

export const useUsers = (options: UseUsersOptions = {}): UseUsersReturn => {
  const { immediate = true, role } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const usersData = await getGlobalUsers();
      const usersArray = Array.isArray(usersData) ? usersData : [];

      const filteredUsers = role
        ? usersArray.filter((user) => user.role === role)
        : usersArray;

      setUsers(filteredUsers);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  const createUser = useCallback(
    async (
      userData: Partial<User> & { password: string }
    ): Promise<User | null> => {
      try {
        setError(null);
        const newUser = await adminApi.users.create(
          userData as {
            name: string;
            email: string;
            password: string;
            role: "lecturer" | "admin";
          }
        );

        if (!role || newUser.role === role) {
          setUsers((prev) => [...prev, newUser]);
        }

        return newUser;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return null;
      }
    },
    [role]
  );

  const updateUser = useCallback(
    async (id: number, userData: Partial<User>): Promise<User | null> => {
      try {
        setError(null);
        const updatedUser = await adminApi.users.update(id, userData);

        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, ...updatedUser } : user
          )
        );

        return updatedUser;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return null;
      }
    },
    []
  );

  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await adminApi.users.delete(id);

      setUsers((prev) => prev.filter((user) => user.id !== id));

      return true;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return false;
    }
  }, []);

  const getUsersByRole = useCallback(
    (targetRole: UserRole): User[] => {
      return users.filter((user) => user.role === targetRole);
    },
    [users]
  );

  useEffect(() => {
    if (immediate) {
      fetchUsers();
    }
  }, [immediate, fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUsersByRole,
  };
};

export const useUserDetail = (userId: number): UseUserDetailReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetail = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      const userData = await adminApi.users.getById(userId);
      setUser(userData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const updateUser = useCallback(
    async (userData: Partial<User>): Promise<User | null> => {
      try {
        setError(null);
        const updatedUser = await adminApi.users.update(userId, userData);

        setUser((prev) => (prev ? { ...prev, ...updatedUser } : updatedUser));

        return updatedUser;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return null;
      }
    },
    [userId]
  );

  const deleteUser = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      await adminApi.users.delete(userId);

      setUser(null);

      return true;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return false;
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUserDetail,
    updateUser,
    deleteUser,
  };
};

export const useAdmins = () => {
  return useUsers({ role: "admin" });
};

export const useLecturers = () => {
  return useUsers({ role: "lecturer" });
};

export const useStudents = () => {
  return useUsers({ role: "student" });
};

export const useUserSearch = (searchTerm: string = "", role?: UserRole) => {
  const { users, isLoading, error, refetch } = useUsers({ role });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return {
    users: filteredUsers,
    isLoading,
    error,
    refetch,
    totalCount: users.length,
    filteredCount: filteredUsers.length,
  };
};
