import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h1 className="font-semibold text-black text-xl">WebGPT</h1>
      <p className="text-sm text-neutral-400 font-bold">
        Make your websites talk.
      </p>
      <div className="flex items-center justify-center gap-2 mt-4">
        <Link href="/auth/signin">
          <Button className="px-2 hover:bg-black hover:text-white text-black border border-neutral-400 shadow-2xl bg-white">
            Sign Up
          </Button>
        </Link>

        <Link href="signup">
          <Button className="px-2 hover:bg-black hover:text-white text-black border border-neutral-400 shadow-2xl bg-white">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}
