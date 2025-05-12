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
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="border rounded-md p-4">
        <p className="font-medium text-lg">{excuse.text}</p>

        <div className="mt-3 text-sm text-gray-500">
          <p>ID: {excuse.id}</p>
          <p>Used Count: {excuse.usedCount}</p>
        </div>
      </div>
    </div>
  );
}
