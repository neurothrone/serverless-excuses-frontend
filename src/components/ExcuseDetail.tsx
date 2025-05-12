import type Excuse from "../types/excuse.ts";

interface ExcuseDetailProps {
  excuse: Excuse | null;
  title: string;
}

export default function ExcuseDetail({ excuse, title }: ExcuseDetailProps) {
  if (!excuse) {
    return null;
  }

  return (
    <div className="p-4 rounded-lg shadow dark-card">
      <h2 className="text-xl font-semibold mb-4 text-violet-300">{title}</h2>

      <div className="rounded-md p-4 bg-gray-800 border border-gray-700">
        <p className="font-medium text-lg text-white">{excuse.text}</p>

        <div className="mt-3 text-sm text-gray-400">
          <p>ID: {excuse.id}</p>
          <p>Used Count: {excuse.usedCount}</p>
        </div>
      </div>
    </div>
  );
}
