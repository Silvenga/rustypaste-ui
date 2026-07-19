import { zodResolver } from "@hookform/resolvers/zod";
import { type PropsWithChildren, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FiInfo } from "react-icons/fi";
import { z } from "zod";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion.tsx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert.tsx";
import { Checkbox } from "./ui/checkbox.tsx";
import { useAuth } from "./useAuth.ts";

const formSchema = z.object({
  authToken: z.string().min(1),
  instanceUrl: z.string().startsWith("http"),
  checkForReleases: z.boolean(),
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
      checkForReleases: true,
    },
    mode: "all",
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      setAuth({
        token: values.authToken,
        instanceUrl: values.instanceUrl,
        checkForReleases: values.checkForReleases,
      });
    },
    [setAuth],
  );

  return (
    <div className="mt-8 flex max-w-md flex-col gap-6">
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
                      Your token will be stored on your device until you logout.
                    </FormDescription>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <Button
                        className="self-end"
                        variant="default"
                        type="submit"
                        disabled={!form.formState.isValid}
                      >
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
                  <AccordionContent className="border-s border-[#6f230b] px-4 pt-4">
                    <FormField
                      control={form.control}
                      name="instanceUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instance URL</FormLabel>
                          <FormDescription className="text-xs">
                            A custom instance URL, useful if you&apos;re not using the same one as
                            this app. If remote, CORS must be enabled.
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
                    <FormField
                      control={form.control}
                      name="checkForReleases"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <div className="flex gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>Check for New Releases</FormLabel>
                              <FormDescription className="text-xs">
                                Once daily, fetch the latest version from GitHub's API. Disable for
                                privacy.
                              </FormDescription>
                            </div>
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
