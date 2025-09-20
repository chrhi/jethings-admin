"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { requestPasswordReset } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordStep1FormData>({
    resolver: zodResolver(forgotPasswordStep1Schema),
  });

  const onSubmit = async (data: ForgotPasswordStep1FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await requestPasswordReset(data);
      setSuccess(true);
      // Navigate to step 2 with email parameter after a short delay
      setTimeout(() => {
        router.push(`/signin/forget-password/step2?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
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

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              Code de vérification envoyé avec succès ! Redirection en cours...
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || success}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {success ? "Code envoyé" : "Envoyer le code de vérification"}
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
