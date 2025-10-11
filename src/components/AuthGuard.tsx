import { type PropsWithChildren, useCallback } from "react";
import { useAuth } from "./useAuth.ts";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert.tsx";
import { FiInfo } from "react-icons/fi";
import { Input } from "@/components/ui/input.tsx";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion.tsx";

const formSchema = z.object({
  authToken: z.string().min(1),
  instanceUrl: z.httpUrl(),
});

export function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children}</> : <Login />;
}

function Login() {

  const { setAuth } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authToken: "",
      instanceUrl: window.location.origin,
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    setAuth({
      token: values.authToken,
      instanceUrl: values.instanceUrl,
    });
  }, [setAuth]);

  return (
    <div className="flex flex-col gap-6 mt-8 max-w-md">

      <Alert>
        <FiInfo />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          <p>This app requires an authentication token to access its features.</p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="authToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auth Token</FormLabel>
                    <FormDescription className="text-xs">
                      Your token will be stored in locally until you logout.
                    </FormDescription>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <Button className="self-end"
                              variant="default"
                              type="submit"
                              disabled={!form.formState.isValid}>
                        Login
                      </Button>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="-mb-4">Advanced Options</AccordionTrigger>
                  <AccordionContent className="pt-4 px-4 border-s border-[#6f230b]">

                    <FormField
                      control={form.control}
                      name="instanceUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instance URL</FormLabel>
                          <FormDescription className="text-xs">
                            A custom instance URL, useful if you're not using the same one as this app.
                            If remote, CORS must be enabled.
                          </FormDescription>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </div>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </form>
          </Form>
        </CardContent>

      </Card>

    </div>
  );
}
