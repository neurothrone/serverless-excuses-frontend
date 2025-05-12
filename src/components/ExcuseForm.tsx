import { type FormEvent, useState } from "react";
import { api } from "../utils/api";
import LoadingButton from "./LoadingButton";

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
              className="w-full dark-input mb-1"
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
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              loadingText="Creating..."
            >
              Create Excuse
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
