import z from "zod";

export const signInSchema = z.object({
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Veuillez saisir une adresse e-mail valide"),
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  });

export  const forgotPasswordStep1Schema = z.object({
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Veuillez saisir une adresse e-mail valide"),
  });


export const forgotPasswordStep2Schema = z.object({
    verificationCode: z
      .string()
      .min(6, "Le code de vérification doit comporter 6 chiffres")
      .max(6, "Le code de vérification doit comporter 6 chiffres")
      .regex(/^\d+$/, "Le code de vérification doit contenir uniquement des chiffres"),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
  