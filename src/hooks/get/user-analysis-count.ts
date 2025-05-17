export const getUserAnalysisResquestCount = async (email: string) => {
  if (!email) throw new Error("Email não fornecido");

  const response = await fetch(
    `http://localhost:3000/api/user/user-analysis-count`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),  
    },
  );
  if (!response.ok) throw new Error("Erro ao buscar contagem de análises");
  return response.json();
};
