const NotFound = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-9xl font-bold text-gray-900">404</h1>
      <p className="text-2xl text-gray-600 mt-4">Page Not Found</p>
      <a href="/" className="mt-8 px-6 py-3 rounded-lg btn-primary">
        Back to Home
      </a>
    </div>
  );
};

export default NotFound;
