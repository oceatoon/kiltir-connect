// Mock auth — frontend only, persisted in localStorage. Backend will replace.
import { useEffect, useState } from "react";

const KEY = "kv_logged_in";

function read(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setLoggedIn(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setLoggedIn(read());
    };
    const onCustom = () => setLoggedIn(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("kv-auth-change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("kv-auth-change", onCustom);
    };
  }, []);

  const login = () => {
    window.localStorage.setItem(KEY, "1");
    window.dispatchEvent(new Event("kv-auth-change"));
  };
  const logout = () => {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("kv-auth-change"));
  };

  return { loggedIn, login, logout };
}
