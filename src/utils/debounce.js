/**
 * Simple debounce function that delays invoking a function until after a specified wait time
 *
 * @param {Function} func The function to debounce
 * @param {number} wait The number of milliseconds to delay
 * @return {Function} The debounced function
 */
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

/**
 * Creates a debounced function that returns a promise that resolves with the result
 * of the function after the specified wait time
 *
 * @param {Function} func The async function to debounce
 * @param {number} wait The number of milliseconds to delay
 * @return {Function} The debounced async function that returns a promise
 */
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
