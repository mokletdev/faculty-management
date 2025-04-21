"use client";

import { PageContainer } from "@/components/layout/page.layout";
import { SectionContainer } from "@/components/layout/section.layout";
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BodyLG, H2 } from "@/components/ui/typography";
import {
  signInSchema,
  type SignInFormData,
} from "@/lib/validations/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosed, EyeIcon, UserIcon } from "lucide-react";
import { signIn, type SignInResponse } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <PageContainer>
      <SectionContainer className="bg-gradient-to-b from-white to-blue-100 lg:flex-row">
        <div className="flex min-h-screen w-full flex-col lg:flex-row lg:justify-between">
          <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <H2 className="text-primary-700 text-3xl font-bold">
                  Selamat Datang!
                </H2>
                <BodyLG className="mt-2 text-gray-600">
                  Masukkan email dan kata sandi anda untuk masuk.
                </BodyLG>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mt-8 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <FormControl>
                            <Input
                              placeholder="Masukkan Email"
                              className="pl-10"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi</FormLabel>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                width="18"
                                height="11"
                                x="3"
                                y="11"
                                rx="2"
                                ry="2"
                              />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          </div>
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Masukkan Password"
                              className="pr-10 pl-10"
                              {...field}
                            />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-500"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeClosed className="size-5" />
                              ) : (
                                <EyeIcon className="size-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Loading..." : "Masuk"}
                  </Button>
                </form>
              </Form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-blue-50 px-2 text-gray-500">atau</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  signIn("google", { redirect: true, redirectTo: "/" }).catch(
                    (err) => console.error(err),
                  );
                }}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="#4285F4"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Masuk dengan Google
              </Button>
            </div>
          </div>

          <Image
            src="/faculty-image.webp?height=1080&width=1080"
            alt="Brawijaya University's Building"
            width={1080}
            height={1080}
            className="h-[960px] w-full max-w-[688px] self-center rounded-4xl object-cover"
            unoptimized
            priority
          />
        </div>
      </SectionContainer>
    </PageContainer>
  );
};
