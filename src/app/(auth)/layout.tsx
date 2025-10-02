import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2, Shield, Users, BarChart3, Zap } from "lucide-react";

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
        {/* Left Column - Enhanced Branding */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center p-12 w-full max-w-xl mx-auto">
            {/* Logo and Title */}
            <div className="space-y-6 text-center mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl group-hover:bg-primary/30 transition-all duration-300"></div>
                <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-3xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <img src="/logo.png" alt="Jethings" className="w-14 h-14" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Jethings Admin
                </h1>
                <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Plateforme d'administration complète pour gérer votre écosystème
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-5 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Sécurisé</h3>
                <p className="text-sm text-muted-foreground">Protection avancée des données</p>
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-5 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Gestion</h3>
                <p className="text-sm text-muted-foreground">Contrôle total des utilisateurs</p>
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-5 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Analytics</h3>
                <p className="text-sm text-muted-foreground">Statistiques en temps réel</p>
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-5 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Rapide</h3>
                <p className="text-sm text-muted-foreground">Performance optimale</p>
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