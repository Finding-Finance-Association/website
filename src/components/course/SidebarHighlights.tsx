// components/course/SidebarHighlights.tsx
import { FiCheck } from "react-icons/fi";

export default function SidebarHighlights() {
  const features = [
    "Lifetime access to course materials",
    "Certificate of completion",
    "Access to private community",
    "Expert instructor support",
    "Mobile and desktop access",
  ];

  return (
    <div className="border-t border-gray-100 pt-6 mt-6">
      <h4 className="font-semibold text-gray-900 mb-4">What You&apos;ll Get:</h4>
      <ul className="space-y-3 text-sm">
        {features.map((item, i) => (
          <li key={i} className="flex items-center gap-3">
            <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
