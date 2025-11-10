"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signInSchema } from "@/schemas/auth";

import Link from "next/link";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { useRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";

export const SignInForm = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error("Failed to sigin. But you should not give up.");
        console.log(error);
      } else {
        toast.success("logged in");
        console.log(data);
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal server error");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Email</FormLabel>
              <FormControl>
                <Input placeholder="Tyler@apple.com" type="email" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input placeholder="Tyler Durden" type="password" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Link href="/auth/signup">
          <p className="text-neutral-400 text-sm my-3 underline underline-offset-4">
            Don' have a account?
          </p>
        </Link>

        <Button
          className="px-4 py-2 bg-black text-white hover:bg-white hover:text-black border hover:border-black border-neutral-400"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
