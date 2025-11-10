"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpSchema } from "@/schemas/auth";
import { authClient } from "@/lib/auth";
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

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export const SignUpForm = () => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      const { data, error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "http://localhost:3001/dashboard",
      });

      if (error) {
        toast.error(
          "Sign up failed. But don't fret lets give it another shot."
        );
        form.reset();
      } else {
        console.log(data);
        toast.success("Signed up. Lets go.");
      }
    } catch (error) {
      console.log(error);
    }

    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Name</FormLabel>
              <FormControl>
                <Input placeholder="Tyler Durden" type="text" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <Link href="/auth/signin">
          <p className="text-neutral-400 text-sm underline underline-offset-4 my-3">
            Already have a account?
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

export default SignUpForm;
