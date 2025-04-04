export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 z-50">
      {/* Loading spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-blue-500 border-opacity-30 rounded-full animate-spin"></div>
        <div className="absolute inset-1 border-4 border-t-transparent border-l-transparent border-r-transparent border-b-blue-500 rounded-full animate-spin animate-duration-2s"></div>
      </div>

      {/* Loading text */}
      <div className="mt-8 text-lg font-medium text-gray-700">
        <span className="inline-block animate-bounce">Loading</span>
        <span className="inline-block animate-bounce animate-delay-200">.</span>
        <span className="inline-block animate-bounce animate-delay-400">.</span>
        <span className="inline-block animate-bounce animate-delay-600">.</span>
      </div>
    </div>
  );
}
