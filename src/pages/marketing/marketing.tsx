import { useEffect } from "react";
import { useNavigate } from "react-router";

import { AUTH_PATHES } from "@/routes/auth.routes";

export function MarketingPage() {
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const mode = queryParams.get("mode");
  const oobCode = queryParams.get("oobCode");

  useEffect(() => {
    if (mode === "resetPassword") {
      navigate(`${AUTH_PATHES.NEW_PASSWORD}?oobCode=${oobCode}`);
    }
  }, []);

  return <div>marketing</div>;
}
