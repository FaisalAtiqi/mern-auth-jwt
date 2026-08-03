import { useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";

interface LocationState {
  from?: Location;
}

export function useLocationState() {
  const location = useLocation();
  const state = location.state as LocationState | null;

  const from = state?.from?.pathname ?? "/";

  return { from, location };
}
