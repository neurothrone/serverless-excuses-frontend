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
    <div className="dark-card dark-card-hover">
      <div className="dark-card-header">
        <h2 className="text-xl font-semibold gradient-text">{title}</h2>
      </div>

      <div className="dark-card-body">
        <div className="glass rounded-lg p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-violet-600"></div>

          <div className="pl-3">
            <p className="font-medium text-xl text-white mb-4">{excuse.text}</p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-800/50 px-3 py-1.5 rounded-full text-sm text-gray-300 flex items-center">
                <span className="w-2 h-2 bg-violet-400 rounded-full mr-2"></span>
                ID: <span className="ml-1 text-violet-300 font-medium">{excuse.id}</span>
              </div>

              <div className="bg-gray-800/50 px-3 py-1.5 rounded-full text-sm text-gray-300 flex items-center">
                <span className="w-2 h-2 bg-violet-400 rounded-full mr-2"></span>
                Used: <span className="ml-1 text-violet-300 font-medium">{excuse.usedCount} times</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
