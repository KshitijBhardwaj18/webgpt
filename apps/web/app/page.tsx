import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h1 className="font-semibold text-black text-xl">WebGPT</h1>
      <div className="flex items-center justify-center gap-2 mt-4">
        <Button className="px-2 hover:bg-black hover:text-white text-black border border-neutral-400 shadow-2xl bg-white">
          Sign Up
        </Button>
        <Button className="px-2 hover:bg-black hover:text-white text-black border border-neutral-400 shadow-2xl bg-white">
          Sign In
        </Button>
      </div>
    </div>
  );
}
