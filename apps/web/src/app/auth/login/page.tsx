"use client";

import { useState } from "react";
import { Button } from "@profs-academie/ui";
import { Input } from "@profs-academie/ui";
import { Label } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { Badge } from "@profs-academie/ui";
import { Eye, EyeOff, Mail, Lock, Users, GraduationCap, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../../contexts/AuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"parent" | "enseignant">("parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation côté client
    if (!email.trim() || !email.includes('@')) {
      setError("Veuillez entrer une adresse email valide");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Le mot de passe est requis");
      setLoading(false);
      return;
    }

    const result = await login(email, password, userType);
    
    if (!result.success) {
      setError(result.error || "Erreur de connexion");
    }
    
    setLoading(false);
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h1>
          <p className="text-gray-600">Accédez à votre espace personnel</p>
        </div>

        {/* User Type Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Type de compte</Label>
          <div className="grid grid-cols-2 gap-3">
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
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {userType === "parent" && "Espace Parent"}
                             {userType === "enseignant" && "Espace Enseignant"}
            </CardTitle>
            <CardDescription>
              {userType === "parent" && "Gérez vos enfants et suivez leur progression"}
                             {userType === "enseignant" && "Créez des cours et accompagnez vos élèves"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button type="submit" className="w-full btn-child" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link href="/auth/register" className="text-primary hover:underline font-medium">
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Comptes de démonstration</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Parent :</span>
                  <span className="font-mono">parent@profsacademie.ca / parent123</span>
                </div>
                                 <div className="flex justify-between">
                   <span className="text-gray-600">Enseignant :</span>
                   <span className="font-mono">prof@profsacademie.ca / prof123</span>
                 </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admin :</span>
                  <span className="font-mono">admin@profsacademie.ca / admin123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
