export function debounce(func, wait = 500) {
  let timeout;

  return function (...args) {
    const context = this;

    // Clear the timeout if it exists
    if (timeout) {
      clearTimeout(timeout);
    }

    // Set a new timeout
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);

    // Return a function to cancel the debounce
    return {
      cancel: () => {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
      },
    };
  };
}

export function debounceAsync(func, wait = 500) {
  let timeout;

  return function (...args) {
    return new Promise((resolve) => {
      const context = this;

      // Clear the timeout if it exists
      if (timeout) {
        clearTimeout(timeout);
      }

      // Set a new timeout
      timeout = setTimeout(async () => {
        try {
          const result = await func.apply(context, args);
          resolve(result);
        } catch (error) {
          resolve({ error });
        }
      }, wait);
    });
  };
}
