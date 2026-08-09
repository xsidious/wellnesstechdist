import { useEffect, useState } from "react";

const KEY = "wtbd_access_v1";

export type AccessRole = "practitioner" | "affiliate";

export type AccessRecord = {
  role: AccessRole;
  name?: string;
  grantedAt: string;
};

export function grantAccess(role: AccessRole, name?: string) {
  try {
    const rec: AccessRecord = { role, name, grantedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(rec));
    window.dispatchEvent(new Event("wtbd:access-changed"));
  } catch {
    /* ignore */
  }
}

export function readAccess(): AccessRecord | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AccessRecord;
  } catch {
    return null;
  }
}

export function clearAccess() {
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("wtbd:access-changed"));
  } catch {
    /* ignore */
  }
}

export function useAccess(): AccessRecord | null {
  const [access, setAccess] = useState<AccessRecord | null>(null);
  useEffect(() => {
    setAccess(readAccess());
    const onChange = () => setAccess(readAccess());
    window.addEventListener("wtbd:access-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("wtbd:access-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return access;
}
