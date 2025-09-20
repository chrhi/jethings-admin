"use client";

import { SignInForm } from "@/features/auth/components";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
    </div>
  );
}
