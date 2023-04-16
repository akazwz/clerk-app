import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";

import ChatPage from "./pages/ChatPage";
import { useState } from "react";

export default function App() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <SignedIn>
        <ChatPage />
      </SignedIn>
      <SignedOut>
        <div className="flex h-screen items-center justify-center">
          <SignInButton mode="modal">
            {loading ? (
              <div className="flex h-screen items-center justify-center">
                <h1 className="font-bold text-3xl">Loading...</h1>
              </div>
            ) : (
              <button className="bg-blue-500 p-3 rounded-lg">
                <h1 className="font-bold">Sign In</h1>
              </button>
            )}
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
