import Navbar from "@/components/Navbar";
import Login from "@/components/Login";

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center bg-gray-50 px-4">
          <Login />
        </main>
      </div>
    </>
  );
}
