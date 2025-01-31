import React, { useState, useEffect } from "react";
import "./AuthUI.css";

const AuthUI = ({ onAuthenticated }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVisible, setOtpVisible] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    const loadSDK = async () => {
      try {
        let retries = 0;
        const maxRetries = 20; // Max retry attempts
        while (!window.OTPless || !window.OTPlessSignin) {
          if (retries >= maxRetries) {
            console.error("SDK failed to load after several attempts.");
            return;
          }
          retries++;
          console.log("Waiting for OTPLESS SDK...");
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        }
        
        // Once the SDK is loaded, initialize OTPLESS
        console.log("SDK Loaded:", window.OTPless, window.OTPlessSignin);
        setSdkLoaded(true);
        initializeOTPLess();
      } catch (error) {
        console.error("Error loading OTPLESS SDK:", error);
      }
    };

    loadSDK();

    return () => {
      // Cleanup any pending async operations when component unmounts
    };
  }, []);

  const initializeOTPLess = () => {
    const callback = (eventCallback) => {
      console.log("OTPLESS Event:", eventCallback);
      if (eventCallback.responseType === "ONETAP") {
        onAuthenticated(eventCallback.response.token);
      }
    };

    new window.OTPless(callback);
  };

  const phoneAuth = async () => {
    if (!sdkLoaded || !window.OTPlessSignin) {
      console.error("OTPlessSignin not available. SDK might not be loaded yet.");
      return;
    }

    try {
      console.log("Initiating OTP with phone:", phone);
      await window.OTPlessSignin.initiate({ channel: "PHONE", phone });
      setOtpVisible(true); // Show OTP input after initiating
    } catch (error) {
      console.error("Error initiating OTP:", error);
    }
  };

  const verifyOTP = async () => {
    if (!sdkLoaded || !window.OTPlessSignin) {
      console.error("OTPlessSignin not available.");
      return;
    }

    try {
      console.log("Verifying OTP...");
      await window.OTPlessSignin.verify({ channel: "PHONE", phone, otp });
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const oauth = async (provider) => {
    if (!sdkLoaded || !window.OTPlessSignin) {
      console.error("OTPlessSignin not available.");
      return;
    }

    try {
      console.log(`Initiating OAuth with ${provider}`);
      await window.OTPlessSignin.initiate({ channel: "OAUTH", channelType: provider });
    } catch (error) {
      console.error(`Error initiating OAuth with ${provider}:`, error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login with OTPLESS</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={phoneAuth} disabled={!sdkLoaded || !phone}>
          {sdkLoaded ? (phone ? "Request OTP" : "Enter Phone Number") : "Loading..."}
        </button>
      </div>

      {otpVisible && (
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}

      <div className="oauth-buttons">
        <button onClick={() => oauth("WHATSAPP")} disabled={!sdkLoaded}>
          Continue with WhatsApp
        </button>
        <button onClick={() => oauth("GMAIL")} disabled={!sdkLoaded}>
          Continue with Gmail
        </button>
      </div>
    </div>
  );
};

export default AuthUI;
