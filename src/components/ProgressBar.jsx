import { createSignal, onCleanup } from "solid-js";

let requestCount = 0;
const [progress, setProgress] = createSignal(0);
const [loading, setLoading] = createSignal(false);
let progressInterval;

export const startProgress = () => {
  requestCount++;
  if (requestCount === 1) {
    setLoading(true);
    setProgress(0);
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + (90 - prev) * 0.1;
        }
        return prev;
      });
    }, 100);
  }
};

export const completeProgress = () => {
  requestCount--;
  if (requestCount === 0) {
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
      clearInterval(progressInterval);
    }, 200);
  }
};

export function ProgressBar() {
  onCleanup(() => {
    clearInterval(progressInterval);
  });

  return (
    <div>
      <div
        class="fixed top-0 left-0 h-1 bg-blue-500 transition-all duration-300 z-50"
        style={{
          width: `${progress()}%`,
          display: loading() ? "block" : "none",
        }}
      />
      <div
        class="fixed top-4 right-4 w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin z-50"
        style={{ display: loading() ? "block" : "none" }}
      />
    </div>
  );
}
