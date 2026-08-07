import { useEffect, useState } from "react";

import { getHasOnboardedAsync } from "@/constants/onboarding";

export function useHasOnboarded() {
  const [hasOnboarded, setHasOnboardedState] = useState<boolean>(false);
  useEffect(() => {
    getHasOnboardedAsync().then(setHasOnboardedState);
  }, []);
  return hasOnboarded;
}
