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

export const acceptInvitationSchema = z.object({
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const createAdminSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez saisir une adresse e-mail valide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    ),
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  phoneNumber: z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Veuillez saisir un numéro de téléphone valide"),
  age: z
    .number()
    .min(18, "L'âge doit être d'au moins 18 ans")
    .max(100, "L'âge doit être inférieur à 100 ans"),
  description: z
    .string()
    .min(1, "La description est requise")
    .min(10, "La description doit contenir au moins 10 caractères"),
});
  