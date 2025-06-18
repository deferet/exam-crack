import React, { useState, useEffect } from "react";

const ActivateAccountPage = () => {
  // We will store the token from the URL here
  const [token, setToken] = useState("");
  // Track whether activation is in progress
  const [isActivating, setIsActivating] = useState(false);
  // Show success or error after we call the API
  const [statusMessage, setStatusMessage] = useState(null);

  // On mount, read `?token=…` from window.location.search
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token") || "";
    setToken(t);
  }, []);

  // Handler for when the user clicks “Activate Account”
  const handleActivate = async () => {
    if (!token) {
      setStatusMessage("No activation token found in URL.");
      return;
    }

    setIsActivating(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/v1/users/activated", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        // If server returns an error status code:
        const errorData = await response.json();
        // You can inspect errorData.message or similar if your API returns more details
        throw new Error(
          errorData.message || `Activation failed (status ${response.status})`
        );
      }

      // Success path:
      setStatusMessage("Your account has been activated successfully! 🎉");
    } catch (err) {
      console.error("Activation error:", err);
      setStatusMessage(
        `Activation failed: ${err.message || "Unknown error"}`
      );
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col items-center justify-center px-6 text-white">
      <div className="bg-[#1e293b] p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6">Activate Account</h1>

        {/* If there is no token param, let the user know */}
        {!token && (
          <p className="text-yellow-300 mb-6">
            No activation token provided. Please check your email link.
          </p>
        )}

        {token && (
          <>
            <p className="text-white mb-6">
              Click the button below to activate your account.
            </p>
            <button
              className={`px-6 py-3 w-full ${
                isActivating
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold rounded-lg transition`}
              onClick={handleActivate}
              disabled={isActivating}
            >
              {isActivating ? "Activating…" : "Activate Account"}
            </button>
          </>
        )}

        {/* Show status message (success/error) after attempting activation */}
        {statusMessage && (
          <p className="mt-6 text-center text-sm text-gray-200">
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivateAccountPage;
