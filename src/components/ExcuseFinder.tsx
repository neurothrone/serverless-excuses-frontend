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
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Get by ID */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Get Excuse by ID</h2>
          <form onSubmit={handleGetById} className="flex items-end gap-2">
            <div className="flex-1">
              <label htmlFor="excuse-id" className="block text-sm font-medium mb-1">
                Excuse ID
              </label>
              <input
                id="excuse-id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter ID..."
                disabled={isLoadingById}
              />
            </div>
            <button
              type="submit"
              disabled={isLoadingById}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoadingById ? "Loading..." : "Get"}
            </button>
          </form>
        </div>

        {/* Get Random */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Get Random Excuse</h2>
          <button
            onClick={handleGetRandom}
            disabled={isLoadingRandom}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            {isLoadingRandom ? "Loading..." : "Get Random Excuse"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-500 text-sm rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
