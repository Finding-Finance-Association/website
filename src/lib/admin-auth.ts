import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",");
// console.log(ADMIN_EMAILS);

export interface AdminUser {
  uid: string;
  email: string;
  isAdmin: boolean;
  role?: string;
}

export async function checkAdminStatus(user: User | null): Promise<boolean> {
  if (!user || !user.email) {
    return false;
  }

  try {
    const allowedEmails = ADMIN_EMAILS.map((e) => e.trim().toLowerCase());
    const userEmail = user.email.toLowerCase().trim();

    if (allowedEmails.includes(userEmail)) {
      return true;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    return userData?.isAdmin === true || userData?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export async function getAdminUser(
  user: User | null
): Promise<AdminUser | null> {
  if (!user) {
    return null;
  }

  const isAdmin = await checkAdminStatus(user);

  if (!isAdmin) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email || "",
    isAdmin: true,
    role: "admin",
  };
}

export async function setAuthCookie(): Promise<void> {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      // Set cookie with httpOnly flag for security
      document.cookie = `firebase-token=${token}; path=/; secure; samesite=strict; max-age=3600`;
    }
  } catch (error) {
    console.error("Error setting auth cookie:", error);
  }
}

export function clearAuthCookie(): void {
  document.cookie =
    "firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export function requireAdminRedirect(currentPath: string = "/admin"): void {
  const loginUrl = `/login?returnUrl=${encodeURIComponent(
    currentPath
  )}&error=admin_access_required`;
  window.location.href = loginUrl;
}
