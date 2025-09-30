"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { forgotPasswordStep2Schema } from "../schema/sign.schema";


type ForgotPasswordStep2FormData = z.infer<typeof forgotPasswordStep2Schema>;

export function ForgotPasswordStep2Form() {
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { verifyPasswordReset, requestPasswordReset } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordStep2FormData>({
    resolver: zodResolver(forgotPasswordStep2Schema),
  });

  const verificationCode = watch("verificationCode");

  // Start resend timer on component mount
  useEffect(() => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data: ForgotPasswordStep2FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await verifyPasswordReset({
        otp: data.verificationCode,
        newPassword: data.newPassword,
      });
      setSuccess(true);
      // Navigate back to signin with success message after a short delay
      setTimeout(() => {
        router.push("/signin?reset=success");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || !email) return;
    
    try {
      await requestPasswordReset({ email });
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Resend code error:", error);
      setError(error instanceof Error ? error.message : 'Erreur lors du renvoi du code');
    }
  };

  if (!email) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-destructive">Aucune adresse e-mail fournie</p>
            <Link href="/signin/forget-password">
              <Button variant="outline">Retour</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <Link href="/signin/forget-password">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle className="text-2xl font-bold">
            Réinitialiser le mot de passe
          </CardTitle>
        </div>
        <CardDescription>
          Nous avons envoyé un code de vérification à 6 chiffres à{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode">Code de vérification</Label>
            <InputOTP
              maxLength={6}
              value={verificationCode || ""}
              onChange={(value) => setValue("verificationCode", value)}
            >
              <InputOTPGroup className="mx-auto">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {errors.verificationCode && (
              <p className="text-sm text-destructive text-center">
                {errors.verificationCode.message}
              </p>
            )}
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              disabled={resendTimer > 0}
              className="text-sm"
            >
              {resendTimer > 0
                ? `Renvoyer le code dans ${resendTimer}s`
                : "Renvoyer le code de vérification"}
            </Button>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              Mot de passe réinitialisé avec succès ! Redirection en cours...
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Entrez votre nouveau mot de passe"
                {...register("newPassword")}
                className={errors.newPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmez le nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmez votre nouveau mot de passe"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
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

          <Button type="submit" className="w-full" disabled={isLoading || success}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {success ? "Réinitialisé avec succès" : "Réinitialiser le mot de passe"}
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
