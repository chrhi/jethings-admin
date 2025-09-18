import { Metadata } from "next";

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
      <div className="container mx-auto px-4">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-primary">Jethings Admin</h1>
              <p className="text-muted-foreground mt-2">
                Gérez votre plateforme Jethings
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
