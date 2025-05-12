import { type FormEvent, useState } from "react";
import { api } from "../utils/api";

interface ExcuseFormProps {
  onExcuseCreated: () => void;
}

export default function ExcuseForm({ onExcuseCreated }: ExcuseFormProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter an excuse");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.createExcuse(text);

      if (response.error) {
        setError(response.error);
      } else {
        setText("");
        onExcuseCreated();
      }
    } catch {
      setError("Failed to create excuse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark-card dark-card-hover">
      <div className="dark-card-header">
        <h2 className="text-xl font-semibold gradient-text">Create New Excuse</h2>
      </div>

      <div className="dark-card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="excuse-text" className="block text-sm font-medium mb-2 text-gray-300">
              Excuse Text
            </label>
            <input
              id="excuse-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full dark-input"
              placeholder="Enter your excuse..."
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-2 rounded bg-red-900/20 border border-red-900/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md disabled:opacity-50 dark-violet-button"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Excuse"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
