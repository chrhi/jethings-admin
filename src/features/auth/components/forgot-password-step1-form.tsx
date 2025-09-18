"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const forgotPasswordStep1Schema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez saisir une adresse e-mail valide"),
});

type ForgotPasswordStep1FormData = z.infer<typeof forgotPasswordStep1Schema>;

export function ForgotPasswordStep1Form() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordStep1FormData>({
    resolver: zodResolver(forgotPasswordStep1Schema),
  });

  const onSubmit = async (data: ForgotPasswordStep1FormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual forgot password logic
      console.log("Forgot password step 1 data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      
      // Navigate to step 2 with email parameter
      router.push(`/signin/forget-password/step2?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Link href="/signin">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle className="text-2xl font-bold">
            Mot de passe oublié
          </CardTitle>
        </div>
        <CardDescription>
          Entrez votre adresse e-mail et nous vous enverrons un code de vérification pour réinitialiser votre mot de passe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse e-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre adresse e-mail"
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Envoyer le code de vérification
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Vous vous souvenez de votre mot de passe ? </span>
          <Link
            href="/signin"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Retour à la connexion
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
