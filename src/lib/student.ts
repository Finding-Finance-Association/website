// lib/admin/students.ts
import { adminDb } from "@/lib/firebase-admin";

export type StudentServer = {
  id: string; 
  uid: string;
  email: string;
  username: string;
  enrolledCourseIds: string[];
};

export async function getAllStudentsServer(): Promise<StudentServer[]> {
  const snap = await adminDb.collection("users").get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as StudentServer[];
}

export async function updateStudentServer(id: string, payload: Partial<StudentServer>) {
  await adminDb.collection("users").doc(id).update(payload);
  return { ok: true };
}

export async function deleteStudentServer(id: string) {
  await adminDb.collection("users").doc(id).delete();
  return { ok: true };
}
