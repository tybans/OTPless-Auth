let sdk; // Declare globally

async function loadSDK() {
  if (!sdk) {
    sdk = await import("your-sdk-library"); // Dynamically import SDK
  }
  return sdk;
}

export const validateToken = async (token) => {
  try {
    await loadSDK(); // Ensure SDK is loaded before making the request

    const response = await fetch("https://your-backend.com/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Token validation failed:", error);
    return { error: "Validation failed", details: error.message };
  }
};
