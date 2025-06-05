import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold">Hello World</h1>
      </div>
    </>
  );
}
