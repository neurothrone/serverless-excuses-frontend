import { useState } from "react";
import { api } from "../utils/api";
import type Excuse from "../types/excuse.ts";
import LoadingButton from "./LoadingButton";

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
    return (
      <div className="dark-card p-8 text-center">
        <div className="flex justify-center mb-4">
          <svg className="animate-spin h-10 w-10 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-300 text-lg">Loading excuses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dark-card">
        <div className="dark-card-header border-red-900/30">
          <h2 className="text-xl font-semibold text-red-400">Error Loading Excuses</h2>
        </div>
        <div className="dark-card-body bg-red-900/10">
          <p className="text-red-300 mb-4">{error}</p>
          <div className="flex justify-end">
            <LoadingButton
              onClick={onRefresh}
              className="bg-red-900/30 text-red-300 rounded-md hover:bg-red-900/40 transition-colors dark-violet-button"
              style={{ backgroundColor: "rgba(127, 29, 29, 0.3)" }}
            >
              Try Again
            </LoadingButton>
          </div>
        </div>
      </div>
    );
  }

  if (excuses.length === 0) {
    return (
      <div className="dark-card">
        <div className="dark-card-header">
          <h2 className="text-xl font-semibold gradient-text">All Excuses</h2>
        </div>
        <div className="dark-card-body text-center py-12">
          <div className="mb-4 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400 text-lg mb-2">No excuses found</p>
          <p className="text-gray-500">Create one to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark-card dark-card-hover">
      <div className="dark-card-header flex justify-between items-center">
        <h2 className="text-xl font-semibold gradient-text">All Excuses</h2>
        <span className="bg-violet-900/30 text-violet-300 px-2 py-1 rounded-full text-xs">
          {excuses.length} {excuses.length === 1 ? 'excuse' : 'excuses'}
        </span>
      </div>

      {deleteError && (
        <div className="p-3 bg-red-900/20 border-y border-red-900/30 text-red-400 text-sm">
          {deleteError}
        </div>
      )}

      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-700/50">
          {excuses.map((excuse) => (
            <li key={excuse.id} className="transition-colors hover:bg-gray-800/50">
              <div className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-grow">
                    <p className="font-medium text-white text-lg mb-2">{excuse.text}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-gray-800/70 px-2 py-1 rounded-md text-gray-400">
                        ID: <span className="text-violet-300">{excuse.id}</span>
                      </span>
                      <span className="bg-gray-800/70 px-2 py-1 rounded-md text-gray-400">
                        Used: <span className="text-violet-300">{excuse.usedCount} times</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2 shrink-0">
                    <LoadingButton
                      onClick={() => onEdit(excuse)}
                      className="bg-violet-900/50 text-violet-300 rounded-md hover:bg-violet-900/70 transition-colors flex items-center dark-violet-button-sm"
                      style={{ backgroundColor: "rgba(76, 29, 149, 0.5)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </LoadingButton>

                    <LoadingButton
                      onClick={() => handleDelete(excuse.id)}
                      isLoading={deleteInProgress === excuse.id}
                      loadingText="Deleting..."
                      className="bg-red-900/30 text-red-300 rounded-md hover:bg-red-900/50 disabled:opacity-50 transition-colors flex items-center dark-violet-button-sm"
                      style={{ backgroundColor: "rgba(127, 29, 29, 0.3)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </LoadingButton>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
