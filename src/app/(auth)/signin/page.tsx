"use client";

import { SignInForm } from "@/features/auth/components";
import { useSearchParams } from "next/navigation";



export default function SignInPage() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';

  return (
    <>
      {resetSuccess && (
        <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
          Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.
        </div>
      )}
      <SignInForm />
    </>
  );
}
