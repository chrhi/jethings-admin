"use client";

import { SignInForm } from "@/features/auth/components";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';

  return (
    <div className="space-y-6">
      {resetSuccess && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.
            </div>
          </CardContent>
        </Card>
      )}
      <SignInForm />
    </div>
  );
}
