import { useState, useEffect } from "react";
import axios from "axios";
import type { Assignment } from "@/types/assignment";
import type { ApiResponse, PaginatedResponse } from "@/types/api";

interface UseAssignmentsOptions {
  initialData?: Assignment[];
  fetchOnMount?: boolean;
}

export function useAssignments(options: UseAssignmentsOptions = {}) {
  const { initialData = [], fetchOnMount = true } = options;

  const [assignments, setAssignments] = useState<Assignment[]>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<PaginatedResponse<Assignment>>(
        "/api/assignments"
      );
      setAssignments(response.data.data);

      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch assignments");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignment = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<ApiResponse<Assignment>>(
        `/api/assignments/${id}`
      );
      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch assignment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (
    data: Omit<Assignment, "id" | "created_at" | "updated_at">
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<ApiResponse<Assignment>>(
        "/api/assignments",
        data
      );
      setAssignments((prev) => [...prev, response.data.data]);

      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create assignment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (id: number, data: Partial<Assignment>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put<ApiResponse<Assignment>>(
        `/api/assignments/${id}`,
        data
      );

      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === id ? response.data.data : assignment
        )
      );

      return response.data.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update assignment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      await axios.delete(`/api/assignments/${id}`);

      setAssignments((prev) =>
        prev.filter((assignment) => assignment.id !== id)
      );

      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete assignment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchAssignments();
    }
  }, [fetchOnMount]);

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    fetchAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}

export default useAssignments;
