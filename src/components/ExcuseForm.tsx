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
    <div className="p-4 rounded-lg shadow dark-card">
      <h2 className="text-xl font-semibold mb-4 text-violet-300">Create New Excuse</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="excuse-text" className="block text-sm font-medium mb-1 text-gray-300">
            Excuse Text
          </label>
          <input
            id="excuse-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            placeholder="Enter your excuse..."
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-md disabled:opacity-50 dark-violet-button"
        >
          {isLoading ? "Creating..." : "Create Excuse"}
        </button>
      </form>
    </div>
  );
}
