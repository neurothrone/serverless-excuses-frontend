import { type FormEvent, useState } from "react";
import { api } from "../utils/api";
import type Excuse from "../types/excuse.ts";

interface ExcuseFinderProps {
  onExcuseFound: (excuse: Excuse) => void;
}

export default function ExcuseFinder({ onExcuseFound }: ExcuseFinderProps) {
  const [id, setId] = useState("");
  const [isLoadingById, setIsLoadingById] = useState(false);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetById = async (e: FormEvent) => {
    e.preventDefault();

    if (!id.trim()) {
      setError("Please enter an ID");
      return;
    }

    setIsLoadingById(true);
    setError(null);

    try {
      const response = await api.getExcuseById(id);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        onExcuseFound(response.data);
        setId("");
      }
    } catch {
      setError("Failed to fetch excuse");
    } finally {
      setIsLoadingById(false);
    }
  };

  const handleGetRandom = async () => {
    setIsLoadingRandom(true);
    setError(null);

    try {
      const response = await api.getRandomExcuse();

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        onExcuseFound(response.data);
      }
    } catch {
      setError("Failed to fetch random excuse");
    } finally {
      setIsLoadingRandom(false);
    }
  };

  return (
    <div className="dark-card dark-card-hover">
      <div className="dark-card-header">
        <h2 className="text-xl font-semibold gradient-text">Find Excuses</h2>
      </div>

      <div className="dark-card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Get by ID */}
          <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-medium mb-3 text-violet-300">Get by ID</h3>
            <form onSubmit={handleGetById}>
              <div className="mb-3">
                <label htmlFor="excuse-id" className="block text-sm font-medium mb-2 text-gray-300">
                  Excuse ID
                </label>
                <input
                  id="excuse-id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full dark-input"
                  placeholder="Enter ID..."
                  disabled={isLoadingById}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoadingById}
                  className="rounded-md disabled:opacity-50 dark-violet-button"
                >
                  {isLoadingById ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Get"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Get Random */}
          <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
            <h3 className="text-lg font-medium mb-3 text-violet-300">Get Random</h3>
            <div className="flex flex-col h-[calc(100%-2rem)]">
              <p className="text-sm text-gray-400 mb-3">
                Get a random excuse from the database.
              </p>
              <div className="flex-grow flex items-end justify-end">
                <button
                  onClick={handleGetRandom}
                  disabled={isLoadingRandom}
                  className="rounded-md disabled:opacity-50 dark-violet-button"
                >
                  {isLoadingRandom ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Get Random"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-900/20 border border-red-900/30 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
