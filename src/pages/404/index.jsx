const NotFound = () => {
  return (
    <div class="h-full w-full flex flex-col items-center justify-center overflow-hidden">
      <h1 class="text-9xl font-bold text-gray-900 dark:text-gray-100">404</h1>
      <p class="text-2xl text-gray-600 dark:text-gray-300 mt-4">
        Page Not Found
      </p>
      <a href="/" class="mt-8 px-6 py-3 rounded-lg btn-primary">
        Back to Home
      </a>
    </div>
  );
};

export default NotFound;
