import { Suspense } from "solid-js";
import Loading from "./Loading";

const CustomSuspense = (Component) => {
  return () => (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export default CustomSuspense;
