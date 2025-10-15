export default function PageHeader({ title, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
        {title}
      </h1>
      {action && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-xl hover:scale-105 transition"
        >
          {action}
        </button>
      )}
    </div>
  );
}
