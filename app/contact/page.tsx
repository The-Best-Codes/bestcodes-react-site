"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ExploreMorePages from "@/components/website/explore_pages";
import Footer from "@/components/website/footer";
import Header from "@/components/website/header";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { Info } from "lucide-react";
import axios from "axios";
import { Check } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const turnstileRef = useRef<any>(null);

  const nodeEnvDev = process.env.NODE_ENV === "development";
  let pageHost;
  if (typeof window !== "undefined") {
    pageHost = window.location.hostname;
  }
  const isDevelopment = nodeEnvDev || pageHost === "localhost";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setIsError(false);

    if (!turnstileRef.current) {
      setIsSubmitting(false);
      setIsError(true);
      return;
    }

    const cloudflareToken = turnstileRef.current.getResponse();

    try {
      const response = await axios.post("/api/contact", {
        ...values,
        cloudflareToken,
      });
      if (response.status === 200) {
        setIsSuccess(true);
        form.reset();
        turnstileRef.current.reset();
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    }

    setIsSubmitting(false);
  }

  return (
    <main className="flex min-h-screen scroll-smooth max-w-screen w-full flex-col items-center dark:bg-slate-900">
      <Header />

      <section className="flex flex-col items-center justify-center w-full flex-1 px-2 sm:px-4 md:px-6 lg:px-20 text-center mt-10">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-center dark:text-white">
            Contact Me
          </h1>
          <p className="mt-3 text-lg text-center dark:text-white">
            Fill out the simple form below to send me a message
          </p>
        </div>
        <Card className="dark:bg-slate-800 dark:text-white dark:border-none w-full max-w-3xl mx-auto">
          <CardContent className="rounded-lg flex flex-col p-4 sm:p-4 md:p-6 lg:p-8">
            {isSuccess ? (
              <div className="max-w-lg w-lg mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-xl text-center dark:text-white">
                  Message sent successfully!
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 w-full"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-left">
                        <FormLabel className="text-left">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            className="text-black dark:text-white dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-left">
                        <FormLabel className="text-left">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your email"
                            className="text-black dark:text-white dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-left">
                        <FormLabel className="text-left">Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message"
                            className="max-h-96 text-black dark:text-white dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isDevelopment ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Info className="h-full w-full max-w-20 max-h-20 sm:w-10 sm:h-10 text-blue-500" />
                      <p className="text-sm text-blue-700 dark:text-blue-300 w-full">
                        Cloudflare Turnstile is disabled in development mode. It
                        will be enabled in production. If you submit this form
                        in development, you will receive an error due to the
                        cloudflare turnstile not being solved.
                      </p>
                    </div>
                  ) : (
                    <Turnstile
                      ref={turnstileRef}
                      siteKey="0x4AAAAAAAfgP80mkF0iiKza"
                    />
                  )}
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                  {isError && (
                    <p className="text-red-500 mt-2">
                      An error occurred. Please try again.
                    </p>
                  )}
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </section>
      <ExploreMorePages currentPath="/contact" />
      <Footer />
    </main>
  );
}
