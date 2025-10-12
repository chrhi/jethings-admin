"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { acceptInvitationSchema } from "../schema/sign.schema";

type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>;

function AcceptInvitationFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { acceptInvitation } = useAuth();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(acceptInvitationSchema),
  });

  const onSubmit = async (data: AcceptInvitationFormData) => {
    if (!token) {
      setError("Token d'invitation manquant");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await acceptInvitation({
        token,
        password: data.password,
      });
      setSuccess(true);
      // Redirect to signin with success message after a short delay
      setTimeout(() => {
        router.push("/signin?accepted=success");
      }, 2000);
    } catch (error) {
      console.error("Accept invitation error:", error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full shadow-none border">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-destructive">Token d'invitation manquant</p>
            <p className="text-sm text-muted-foreground">
              Veuillez utiliser le lien d'invitation reçu par email.
            </p>
            <Link href="/signin">
              <Button variant="outline">Retour à la connexion</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-none border">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center">
          Accepter l'invitation
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Créez votre mot de passe pour finaliser votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Entrez votre mot de passe"
                {...register("password")}
                className={`h-11 pr-10 ${errors.password ? "border-destructive" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmez le mot de passe</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmez votre mot de passe"
                {...register("confirmPassword")}
                className={`h-11 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              Compte créé avec succès ! Redirection en cours...
            </div>
          )}

          <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading || success}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {success ? "Compte créé" : "Créer mon compte"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Vous avez déjà un compte ? </span>
          <Link
            href="/signin"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function AcceptInvitationForm() {
  return (
    <Suspense fallback={
      <Card className="w-full shadow-none border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    }>
      <AcceptInvitationFormContent />
    </Suspense>
  );
}
