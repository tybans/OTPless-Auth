export const validateToken = async (token) => {
  try {
    const response = await fetch("https://your-backend.com/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Token validation failed:", error);
  }
};
