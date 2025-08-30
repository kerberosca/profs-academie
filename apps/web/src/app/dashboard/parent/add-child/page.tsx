"use client";

import { useState } from "react";
import { Button } from "@profs-academie/ui";
import { Input } from "@profs-academie/ui";
import { Label } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { ArrowLeft, Heart, User, Calendar, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";

export default function AddChildPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    grade: "",
    pin: "1234" // PIN par défaut
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.birthDate || !formData.grade) {
      setError("Tous les champs sont requis");
      setLoading(false);
      return;
    }

    try {
      if (!user) {
        setError("Vous devez être connecté pour ajouter un enfant");
        setLoading(false);
        return;
      }
      
      const parentId = user.id;
      
      const response = await fetch('/api/parent/add-child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          grade: formData.grade,
          pin: formData.pin,
          parentId: parentId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Rediriger vers le tableau de bord parent avec un message de succès
        router.push('/dashboard/parent?success=child-added');
      } else {
        setError(data.error || "Erreur lors de l'ajout de l'enfant");
      }
    } catch (error) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/dashboard/parent" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord parent
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src="/logo.png" alt="Profs Académie" className="w-12 h-12" />
            <span className="text-2xl font-bold text-dark-900">Profs Académie</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter un enfant</h1>
          <p className="text-gray-600">Créez un compte pour votre enfant</p>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Nouveau compte enfant</CardTitle>
            <CardDescription>
              Remplissez les informations pour créer le compte de votre enfant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Emma"
                      className="pl-10"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastName">Nom de famille</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Tremblay"
                      className="pl-10"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
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
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    id="grade"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.grade}
                    onChange={(e) => handleInputChange("grade", e.target.value)}
                    required
                  >
                    <option value="">Sélectionner un niveau</option>
                    <option value="Maternelle">Maternelle</option>
                    <option value="1ère année">1ère année</option>
                    <option value="2ème année">2ème année</option>
                    <option value="3ème année">3ème année</option>
                    <option value="4ème année">4ème année</option>
                    <option value="5ème année">5ème année</option>
                    <option value="6ème année">6ème année</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="pin">PIN de connexion</Label>
                <div className="relative">
                  <Heart className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="pin"
                    type="password"
                    placeholder="1234"
                    className="pl-10"
                    value={formData.pin}
                    onChange={(e) => handleInputChange("pin", e.target.value)}
                    required
                    minLength={4}
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ce PIN sera utilisé par votre enfant pour se connecter
                </p>
              </div>

              <Button type="submit" className="w-full btn-child" disabled={loading}>
                {loading ? "Création..." : "Créer le compte enfant"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Informations importantes</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Le compte sera automatiquement associé à votre foyer</li>
                <li>• Votre enfant pourra se connecter avec son prénom et son PIN</li>
                <li>• Vous pourrez gérer ses paramètres depuis votre tableau de bord</li>
                <li>• Le PIN peut être modifié ultérieurement</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
