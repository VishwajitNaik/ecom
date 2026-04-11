import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";

export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );
  }
};

export const sendOtpFirebase = async (phone) => {
  setupRecaptcha();

  const confirmationResult = await signInWithPhoneNumber(
    auth,
    "+91" + phone,
    window.recaptchaVerifier
  );

  window.confirmationResult = confirmationResult;
};

export const verifyOtpFirebase = async (otp) => {
  const result = await window.confirmationResult.confirm(otp);
  return result.user;
};