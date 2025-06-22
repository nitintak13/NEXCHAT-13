import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [isNext, setIsNext] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const { login } = useContext(AuthContext);

  const resetFields = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
    setIsNext(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentState === "Sign up" && !isNext) {
      setIsNext(true);
      return;
    }

    setIsSubmitting(true);
    await login(currentState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1d2f] to-[#2c284d] flex items-center justify-center max-sm:px-5 py-10">
      {/* Logo */}

      <div className="absolute top-10 text-center text-white">
        <h1 className="text-3xl font-bold tracking-wide">NEXChat</h1>
        <p className="text-sm text-violet-300 mt-1">
          Private. Real-time. Smart Chat for You.
        </p>
      </div>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1f1b3a] text-white border border-gray-600 p-8 rounded-lg shadow-xl w-[min(90vw,450px)] max-w-md flex flex-col gap-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{currentState}</h2>
          {currentState === "Sign up" && isNext && (
            <img
              onClick={() => setIsNext(false)}
              src={assets.arrow_icon}
              className="w-5 cursor-pointer"
            />
          )}
        </div>

        {currentState === "Sign up" && !isNext && (
          <input
            type="text"
            placeholder="Full Name"
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}

        {!isNext && (
          <>
            <input
              type="email"
              placeholder="Email address"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        {currentState === "Sign up" && isNext && (
          <textarea
            placeholder="Short bio..."
            rows={4}
            className="input resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        )}

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-violet-600 py-3 rounded-md font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Processing..."
            : currentState === "Sign up"
            ? isNext
              ? "Create Account"
              : "Next"
            : "Login Now"}
        </button>

        <div className="text-center text-sm">
          {currentState === "Sign up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Login");
                  resetFields();
                }}
                className="text-violet-400 font-medium cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign up");
                  resetFields();
                }}
                className="text-violet-400 font-medium cursor-pointer"
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
