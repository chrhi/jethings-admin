import MaxWidthWrapper from "@/components/max-with-wrapper";
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
      <MaxWidthWrapper className="flex w-full h-full items-center justify-center"> 
        <div className="w-full max-w-md pt-20">
          {children}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
