import { useState, useEffect } from "react";
import { api } from "./utils/api";
import ExcuseForm from "./components/ExcuseForm";
import ExcuseList from "./components/ExcuseList";
import ExcuseEditor from "./components/ExcuseEditor";
import ExcuseFinder from "./components/ExcuseFinder";
import ExcuseDetail from "./components/ExcuseDetail";
import type Excuse from "./types/excuse.ts";

function App() {
  // State for all excuses
  const [excuses, setExcuses] = useState<Excuse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for editing
  const [editingExcuse, setEditingExcuse] = useState<Excuse | null>(null);

  // State for found excuse (by ID or random)
  const [foundExcuse, setFoundExcuse] = useState<Excuse | null>(null);

  // Fetch all excuses
  const fetchExcuses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getAllExcuses();

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setExcuses(response.data);
      }
    } catch {
      setError("Failed to fetch excuses");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchExcuses();
  }, []);

  // Handle excuse creation
  const handleExcuseCreated = () => {
    fetchExcuses();
  };

  // Handle excuse editing
  const handleEditExcuse = (excuse: Excuse) => {
    setEditingExcuse(excuse);
  };

  // Handle excuse found (by ID or random)
  const handleExcuseFound = (excuse: Excuse) => {
    setFoundExcuse(excuse);
  };

  return (
    <div className="min-h-screen py-8 dark">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-violet-300">Serverless Excuses</h1>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Create Form */}
          <section>
            <ExcuseForm
              onExcuseCreated={handleExcuseCreated}
            />
          </section>

          {/* Finder Section */}
          <section>
            <ExcuseFinder
              onExcuseFound={handleExcuseFound}
            />
          </section>

          {/* Found Excuse */}
          {foundExcuse && (
            <section>
              <ExcuseDetail
                excuse={foundExcuse}
                title={`Found Excuse`}
              />
            </section>
          )}

          {/* Excuses List */}
          <section>
            <ExcuseList
              excuses={excuses}
              isLoading={isLoading}
              error={error}
              onRefresh={fetchExcuses}
              onEdit={handleEditExcuse}
            />
          </section>
        </div>

        {/* Editor Modal */}
        {editingExcuse && (
          <ExcuseEditor
            excuse={editingExcuse}
            onClose={() => setEditingExcuse(null)}
            onSaved={fetchExcuses}
          />
        )}
      </div>
    </div>
  );
}

export default App;
