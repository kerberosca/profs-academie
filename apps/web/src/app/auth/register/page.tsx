"use client";

import { useState } from "react";
import { Button } from "@profs-academie/ui";
import { Input } from "@profs-academie/ui";
import { Label } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";
import { Eye, EyeOff, Mail, Lock, Users, GraduationCap, Heart, ArrowLeft, User, Phone, MapPin, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<"parent" | "enseignant" | "child">("parent");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  
  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    specialty: "",
    experience: "",
    birthDate: "",
    grade: "",
    parentEmail: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    const userData = {
      ...formData,
      userType
    };

    const result = await register(userData);
    
    if (!result.success) {
      setError(result.error || "Erreur d'inscription");
    }
    
    setLoading(false);
  };

  const renderParentForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Prénom</Label>
          <Input 
            id="firstName" 
            placeholder="Marie" 
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required 
          />
        </div>
        <div>
          <Label htmlFor="lastName">Nom</Label>
          <Input 
            id="lastName" 
            placeholder="Tremblay" 
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="email" 
            type="email" 
            placeholder="marie@email.com" 
            className="pl-10" 
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required 
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="phone" 
            type="tel" 
            placeholder="(514) 555-0123" 
            className="pl-10"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="city">Ville</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            id="city" 
            placeholder="Montréal" 
            className="pl-10"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );

     const renderEnseignantForm = () => (
     <div className="space-y-4">
       <div className="grid grid-cols-2 gap-4">
         <div>
           <Label htmlFor="firstName">Prénom</Label>
           <Input 
             id="firstName" 
             placeholder="Jean" 
             value={formData.firstName}
             onChange={(e) => handleInputChange("firstName", e.target.value)}
             required 
           />
         </div>
         <div>
           <Label htmlFor="lastName">Nom</Label>
           <Input 
             id="lastName" 
             placeholder="Bouchard" 
             value={formData.lastName}
             onChange={(e) => handleInputChange("lastName", e.target.value)}
             required 
           />
         </div>
       </div>
       
       <div>
         <Label htmlFor="email">Email professionnel</Label>
         <div className="relative">
           <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
           <Input 
             id="email" 
             type="email" 
             placeholder="jean.bouchard@ecole.qc.ca" 
             className="pl-10" 
             value={formData.email}
             onChange={(e) => handleInputChange("email", e.target.value)}
             required 
           />
         </div>
       </div>

       <div>
         <Label htmlFor="specialty">Spécialité</Label>
         <div className="relative">
           <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
           <Input 
             id="specialty" 
             placeholder="Mathématiques, Français, Sciences..." 
             className="pl-10"
             value={formData.specialty}
             onChange={(e) => handleInputChange("specialty", e.target.value)}
           />
         </div>
       </div>

       <div>
         <Label htmlFor="experience">Années d'expérience</Label>
         <Input 
           id="experience" 
           type="number" 
           placeholder="5" 
           min="0" 
           max="50"
           value={formData.experience}
           onChange={(e) => handleInputChange("experience", e.target.value)}
         />
       </div>

       <div>
         <Label htmlFor="city">Ville</Label>
         <div className="relative">
           <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
           <Input 
             id="city" 
             placeholder="Québec" 
             className="pl-10"
             value={formData.city}
             onChange={(e) => handleInputChange("city", e.target.value)}
           />
         </div>
       </div>

       <div>
         <Label htmlFor="password">Mot de passe</Label>
         <div className="relative">
           <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
           <Input
             id="password"
             type={showPassword ? "text" : "password"}
             placeholder="••••••••"
             className="pl-10 pr-10"
             value={formData.password}
             onChange={(e) => handleInputChange("password", e.target.value)}
             required
           />
           <button
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
           >
             {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
           </button>
         </div>
       </div>

       <div>
         <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
         <div className="relative">
           <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
           <Input
             id="confirmPassword"
             type={showConfirmPassword ? "text" : "password"}
             placeholder="••••••••"
             className="pl-10 pr-10"
             value={formData.confirmPassword}
             onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
             required
           />
           <button
             type="button"
             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
             className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
           >
             {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
           </button>
         </div>
       </div>
     </div>
   );

     const renderChildForm = () => (
     <div className="space-y-4">
       <div className="grid grid-cols-2 gap-4">
         <div>
           <Label htmlFor="firstName">Prénom</Label>
           <Input 
             id="firstName" 
             placeholder="Emma" 
             value={formData.firstName}
             onChange={(e) => handleInputChange("firstName", e.target.value)}
             required 
           />
         </div>
         <div>
           <Label htmlFor="lastName">Nom</Label>
           <Input 
             id="lastName" 
             placeholder="Tremblay" 
             value={formData.lastName}
             onChange={(e) => handleInputChange("lastName", e.target.value)}
             required 
           />
         </div>
       </div>
       
       <div>
         <Label htmlFor="birthDate">Date de naissance</Label>
         <div className="relative">
           <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
           <Input 
             id="birthDate" 
             type="date" 
             className="pl-10" 
             value={formData.birthDate}
             onChange={(e) => handleInputChange("birthDate", e.target.value)}
             required 
           />
         </div>
       </div>

       <div>
         <Label htmlFor="grade">Niveau scolaire</Label>
         <select 
           id="grade" 
           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
           value={formData.grade}
           onChange={(e) => handleInputChange("grade", e.target.value)}
         >
           <option value="">Sélectionner un niveau</option>
           <option value="maternelle">Maternelle</option>
           <option value="1ere">1ère année</option>
           <option value="2eme">2ème année</option>
           <option value="3eme">3ème année</option>
           <option value="4eme">4ème année</option>
           <option value="5eme">5ème année</option>
           <option value="6eme">6ème année</option>
         </select>
       </div>

       <div>
         <Label htmlFor="parentEmail">Email du parent</Label>
         <div className="relative">
           <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
           <Input 
             id="parentEmail" 
             type="email" 
             placeholder="parent@email.com" 
             className="pl-10" 
             value={formData.parentEmail}
             onChange={(e) => handleInputChange("parentEmail", e.target.value)}
             required 
           />
         </div>
       </div>

       <div>
         <Label htmlFor="password">Mot de passe</Label>
         <div className="relative">
           <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
           <Input
             id="password"
             type={showPassword ? "text" : "password"}
             placeholder="••••••••"
             className="pl-10 pr-10"
             value={formData.password}
             onChange={(e) => handleInputChange("password", e.target.value)}
             required
           />
           <button
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
           >
             {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
           </button>
         </div>
       </div>

       <div>
         <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
         <div className="relative">
           <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
           <Input
             id="confirmPassword"
             type={showConfirmPassword ? "text" : "password"}
             placeholder="••••••••"
             className="pl-10 pr-10"
             value={formData.confirmPassword}
             onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
             required
           />
           <button
             type="button"
             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
             className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
           >
             {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
           </button>
         </div>
       </div>
     </div>
   );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
                     <div className="flex items-center justify-center space-x-3 mb-4">
             <img src="/logo.png" alt="Profs Académie" className="w-12 h-12" />
             <span className="text-2xl font-bold text-dark-900">Profs Académie</span>
           </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
          <p className="text-gray-600">Rejoignez la communauté éducative québécoise</p>
        </div>

        {/* User Type Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Type de compte</Label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setUserType("parent")}
              className={`p-3 rounded-lg border-2 transition-all ${
                userType === "parent"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 bg-white hover:border-primary/50"
              }`}
            >
              <Users className="w-5 h-5 mx-auto mb-2" />
              <span className="text-xs font-medium">Parent</span>
            </button>
            <button
                             onClick={() => setUserType("enseignant")}
               className={`p-3 rounded-lg border-2 transition-all ${
                 userType === "enseignant"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 bg-white hover:border-primary/50"
              }`}
            >
              <GraduationCap className="w-5 h-5 mx-auto mb-2" />
                             <span className="text-xs font-medium">Enseignant</span>
            </button>
            <button
              onClick={() => setUserType("child")}
              className={`p-3 rounded-lg border-2 transition-all ${
                userType === "child"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 bg-white hover:border-primary/50"
              }`}
            >
              <Heart className="w-5 h-5 mx-auto mb-2" />
              <span className="text-xs font-medium">Enfant</span>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {userType === "parent" && "Inscription Parent"}
                             {userType === "enseignant" && "Inscription Enseignant"}
              {userType === "child" && "Inscription Enfant"}
            </CardTitle>
            <CardDescription>
              {userType === "parent" && "Créez votre compte pour suivre vos enfants"}
                             {userType === "enseignant" && "Rejoignez notre équipe d'enseignants"}
              {userType === "child" && "Commence ton aventure d'apprentissage !"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              {userType === "parent" && renderParentForm()}
                             {userType === "enseignant" && renderEnseignantForm()}
              {userType === "child" && renderChildForm()}

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="rounded border-gray-300" required />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  J'accepte les{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              <Button type="submit" className="w-full btn-child" disabled={loading}>
                {loading ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
