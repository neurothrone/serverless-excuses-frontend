import { useState } from "react";
import { api } from "../utils/api";
import type Excuse from "../types/excuse.ts";

interface ExcuseListProps {
  excuses: Excuse[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onEdit: (excuse: Excuse) => void;
}

export default function ExcuseList({
  excuses,
  isLoading,
  error,
  onRefresh,
  onEdit
}: ExcuseListProps) {
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this excuse?")) {
      setDeleteInProgress(id);
      setDeleteError(null);

      try {
        const response = await api.deleteExcuse(id);

        if (response.error) {
          setDeleteError(`Failed to delete: ${response.error}`);
        } else {
          onRefresh();
        }
      } catch {
        setDeleteError("An error occurred while deleting");
      } finally {
        setDeleteInProgress(null);
      }
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading excuses...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        <p>Error loading excuses: {error}</p>
        <button
          onClick={onRefresh}
          className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (excuses.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No excuses found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="text-xl font-semibold p-4 border-b">All Excuses</h2>

      {deleteError && (
        <div className="p-3 bg-red-50 text-red-500 text-sm border-b">
          {deleteError}
        </div>
      )}

      <ul className="divide-y">
        {excuses.map((excuse) => (
          <li key={excuse.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{excuse.text}</p>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="mr-3">ID: {excuse.id}</span>
                  <span>Used: {excuse.usedCount} times</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(excuse)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(excuse.id)}
                  disabled={deleteInProgress === excuse.id}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50"
                >
                  {deleteInProgress === excuse.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
