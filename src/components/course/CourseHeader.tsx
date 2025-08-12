import { FiAward } from "react-icons/fi";

interface CourseHeaderProps {
  title: string;
  showStats?: boolean;
}

export default function CourseHeader({ title, showStats = true }: CourseHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-600 text-white p-8 sm:p-12 rounded-2xl shadow-2xl shadow-emerald-500/20 mb-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-6xl">📚</div>
        <div className="absolute bottom-4 left-4 text-6xl">💡</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">
          $
        </div>
      </div>
      <div className="relative z-10">
        <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">{title}</h1>
        {showStats && (
          <div className="flex flex-wrap items-center gap-6 text-emerald-100">
            <div className="flex items-center gap-2">
              <FiAward className="w-5 h-5" />
              <span>Certificate included</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
