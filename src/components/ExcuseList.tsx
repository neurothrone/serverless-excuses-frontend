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
    return <div className="p-4 text-center text-gray-300">Loading excuses...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 text-red-400 rounded-lg">
        <p>Error loading excuses: {error}</p>
        <button
          onClick={onRefresh}
          className="mt-2 px-3 py-1 bg-red-900/30 text-red-300 rounded-md hover:bg-red-900/40"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (excuses.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No excuses found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="dark-card rounded-lg shadow overflow-hidden">
      <h2 className="text-xl font-semibold p-4 border-b border-gray-700 text-violet-300">All Excuses</h2>

      {deleteError && (
        <div className="p-3 bg-red-900/20 text-red-400 text-sm border-b border-gray-700">
          {deleteError}
        </div>
      )}

      <ul className="divide-y divide-gray-700">
        {excuses.map((excuse) => (
          <li key={excuse.id} className="p-4 hover:bg-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-white">{excuse.text}</p>
                <div className="mt-1 text-sm text-gray-400">
                  <span className="mr-3">ID: {excuse.id}</span>
                  <span>Used: {excuse.usedCount} times</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(excuse)}
                  className="px-3 py-1 bg-violet-900/50 text-violet-300 rounded-md hover:bg-violet-900/70"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(excuse.id)}
                  disabled={deleteInProgress === excuse.id}
                  className="px-3 py-1 bg-red-900/30 text-red-300 rounded-md hover:bg-red-900/50 disabled:opacity-50"
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
