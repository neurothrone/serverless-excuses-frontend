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
    <div className="dark">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">Serverless Excuses</h1>
          <p className="text-dark-text-secondary">Your go-to excuse generator for any situation</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left Column - Create and Find */}
          <div className="lg:col-span-2 space-y-4">
            {/* Create Form */}
            <section className="fade-in" style={{ animationDelay: '0.1s' }}>
              <ExcuseForm
                onExcuseCreated={handleExcuseCreated}
              />
            </section>

            {/* Finder Section */}
            <section className="fade-in" style={{ animationDelay: '0.2s' }}>
              <ExcuseFinder
                onExcuseFound={handleExcuseFound}
              />
            </section>

            {/* Found Excuse - Mobile Only */}
            {foundExcuse && (
              <section className="lg:hidden fade-in" style={{ animationDelay: '0.3s' }}>
                <ExcuseDetail
                  excuse={foundExcuse}
                  title={`Found Excuse`}
                />
              </section>
            )}
          </div>

          {/* Right Column - Results and List */}
          <div className="lg:col-span-3 space-y-8">
            {/* Found Excuse - Desktop Only */}
            {foundExcuse && (
              <section className="hidden lg:block fade-in" style={{ animationDelay: '0.3s' }}>
                <ExcuseDetail
                  excuse={foundExcuse}
                  title={`Found Excuse`}
                />
              </section>
            )}

            {/* Excuses List */}
            <section className="fade-in" style={{ animationDelay: '0.4s' }}>
              <ExcuseList
                excuses={excuses}
                isLoading={isLoading}
                error={error}
                onRefresh={fetchExcuses}
                onEdit={handleEditExcuse}
              />
            </section>
          </div>
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
