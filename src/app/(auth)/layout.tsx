import MaxWidthWrapper from "@/components/max-with-wrapper";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentification - Jethings Admin",
  description: "Connectez-vous à votre compte Jethings Admin",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="flex h-screen">
        {/* Left Column - Branding */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 to-primary/5 items-center justify-center p-12">
          <div className="max-w-md text-center space-y-8">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center">
                <img src="/logo.png" alt="Jethings" className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Jethings Admin</h1>
              <p className="text-lg text-muted-foreground">
                Gérez votre plateforme avec facilité et efficacité
              </p>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Interface intuitive et moderne</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Gestion complète des utilisateurs</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Tableaux de bord en temps réel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
