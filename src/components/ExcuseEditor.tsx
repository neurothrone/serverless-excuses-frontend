import { useState, useEffect, type FormEvent } from "react";
import { api } from "../utils/api";
import type Excuse from "../types/excuse.ts";
import LoadingButton from "./LoadingButton";

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

  // If no excuse is provided, don't render anything
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s]">
      <div
        className="glass max-w-md w-full rounded-xl shadow-lg border border-gray-700/50 overflow-hidden modal-slide-in"
      >
        <div className="dark-card-header flex justify-between items-center border-b border-gray-700/50">
          <h2 className="text-xl font-semibold gradient-text">Edit Excuse</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800/50 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="edit-excuse-text" className="block text-sm font-medium mb-2 text-gray-300">
                Excuse Text
              </label>
              <input
                id="edit-excuse-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full dark-input"
                disabled={isLoading}
                autoFocus
              />
            </div>

            <div className="flex flex-wrap gap-3 mb-5">
              <div className="bg-gray-800/50 px-3 py-1.5 rounded-md text-sm text-gray-300 flex items-center">
                <span className="w-2 h-2 bg-violet-400 rounded-full mr-2"></span>
                ID: <span className="ml-1 text-violet-300 font-medium">{excuse.id}</span>
              </div>

              <div className="bg-gray-800/50 px-3 py-1.5 rounded-md text-sm text-gray-300 flex items-center">
                <span className="w-2 h-2 bg-violet-400 rounded-full mr-2"></span>
                Used: <span className="ml-1 text-violet-300 font-medium">{excuse.usedCount} times</span>
              </div>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-md bg-red-900/20 border border-red-900/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <LoadingButton
                type="button"
                onClick={onClose}
                className="border border-gray-700/50 rounded-md hover:bg-gray-800/50 text-gray-300 transition-colors dark-violet-button"
                style={{ backgroundColor: "transparent" }}
                disabled={isLoading}
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                type="submit"
                isLoading={isLoading}
                loadingText="Saving..."
              >
                Save Changes
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
