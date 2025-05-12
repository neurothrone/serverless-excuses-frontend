import { useState, useEffect, type FormEvent } from "react";
import { api } from "../utils/api";
import type Excuse from "../types/excuse.ts";

interface ExcuseEditorProps {
  excuse: Excuse | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ExcuseEditor({ excuse, onClose, onSaved }: ExcuseEditorProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update the text when the excuse changes
  useEffect(() => {
    if (excuse) {
      setText(excuse.text);
    }
  }, [excuse]);

  // If no excuse is provided, don"t render anything
  if (!excuse) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter an excuse");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.updateExcuse(excuse.id, text);

      if (response.error) {
        setError(response.error);
      } else {
        onSaved();
        onClose();
      }
    } catch {
      setError("Failed to update excuse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="dark-card rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-violet-300">Edit Excuse</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-excuse-text" className="block text-sm font-medium mb-1 text-gray-300">
              Excuse Text
            </label>
            <input
              id="edit-excuse-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              disabled={isLoading}
            />
          </div>

          <div className="text-sm text-gray-400 mb-4">
            <p>ID: {excuse.id}</p>
            <p>Used Count: {excuse.usedCount}</p>
          </div>

          {error && (
            <div className="mb-4 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800 text-gray-300"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 dark-violet-button rounded-md disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
