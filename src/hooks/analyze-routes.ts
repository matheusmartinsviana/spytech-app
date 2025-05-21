import { NEXT_BACKEND_URL } from "@/utils/constants";

export const analyzeRoutes = async (url: string) => {
  const response = await fetch(`${NEXT_BACKEND_URL}/api/analyze-routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(url),
  });
  return response.json();
};
