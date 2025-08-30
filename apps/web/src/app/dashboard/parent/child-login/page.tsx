"use client";

import { useState, useEffect } from "react";
import { Button } from "@profs-academie/ui";
import { Input } from "@profs-academie/ui";
import { Label } from "@profs-academie/ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@profs-academie/ui";
import { ArrowLeft, Heart, Lock, User, Shield, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";

interface Enfant {
  id: string;
  prenom: string;
  nom?: string;
  anneeNaissance: number;
  niveauScolaire?: string;
}

export default function ChildLoginPage() {
  const { user } = useAuth();
  const [enfants, setEnfants] = useState<Enfant[]>([]);
  const [selectedEnfant, setSelectedEnfant] = useState<Enfant | null>(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingEnfants, setLoadingEnfants] = useState(true);
  const router = useRouter();

  // Récupérer les enfants du parent connecté
  useEffect(() => {
    const fetchEnfants = async () => {
      if (!user) return;
      
      try {
        // Récupérer les données utilisateur depuis localStorage
        const userData = localStorage.getItem('userData');
        
        const response = await fetch(`/api/parent/enfants-secure`, {
          headers: {
            'Content-Type': 'application/json',
            'x-user-data': userData || JSON.stringify(user), // Envoyer les données utilisateur
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Enfants récupérés:', data);
          setEnfants(data.enfants || []);
        } else {
          const errorData = await response.json();
          console.error('Erreur API:', errorData);
          setError("Erreur lors du chargement des enfants: " + (errorData.error || 'Erreur inconnue'));
        }
      } catch (error) {
        console.error('Erreur fetch:', error);
        setError("Erreur de connexion");
      } finally {
        setLoadingEnfants(false);
      }
    };

    fetchEnfants();
  }, [user]);

  const handleEnfantSelect = (enfant: Enfant) => {
    setSelectedEnfant(enfant);
    setPin("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedEnfant || !pin.trim()) {
      setError("Veuillez sélectionner un enfant et entrer le PIN");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login-child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prenom: selectedEnfant.prenom, 
          pin,
          parentId: user?.id // Ajouter l'ID du parent pour vérification
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker les données de l'enfant pour la session
        localStorage.setItem('childSession', JSON.stringify({
          enfant: selectedEnfant,
          parentId: user?.id,
          timestamp: new Date().toISOString()
        }));
        
        // Rediriger vers le tableau de bord enfant
        router.push('/dashboard/child');
      } else {
        setError(data.error || "PIN incorrect");
      }
    } catch (error) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  if (loadingEnfants) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des enfants...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion Enfant</h1>
          <p className="text-gray-600">Connectez-vous en tant qu'enfant pour accéder à son espace</p>
        </div>

        {/* Parent Info */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-gray-600">Parent connecté</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              Sélectionner un enfant
            </CardTitle>
            <CardDescription>
              Choisissez l'enfant pour lequel vous voulez vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enfants.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Aucun enfant trouvé dans votre foyer</p>
                <Link href="/dashboard/parent/add-child">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un enfant
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sélection d'enfant */}
                <div className="space-y-3">
                  <Label htmlFor="enfant">Choisir un enfant</Label>
                  <div className="grid gap-3">
                    {enfants.map((enfant) => (
                      <button
                        key={enfant.id}
                        type="button"
                        onClick={() => handleEnfantSelect(enfant)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedEnfant?.id === enfant.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 bg-white hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">
                              {enfant.prenom.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{enfant.prenom}</div>
                            <div className="text-sm text-gray-500">
                              {enfant.niveauScolaire || 'Niveau non défini'}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* PIN */}
                {selectedEnfant && (
                  <div className="space-y-3">
                    <Label htmlFor="pin">PIN de {selectedEnfant.prenom}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="pin"
                        type="password"
                        placeholder="Entrez le PIN"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="pl-10"
                        maxLength={4}
                        pattern="[0-9]*"
                        inputMode="numeric"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Le PIN est un code à 4 chiffres défini lors de la création du compte enfant
                    </p>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full btn-child" 
                  disabled={loading || !selectedEnfant || !pin.trim()}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Connexion...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Se connecter en tant que {selectedEnfant?.prenom}
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Sécurité</h3>
              <p className="text-sm text-blue-700">
                Vous accédez à l'espace de votre enfant. Toutes les actions seront enregistrées 
                sous son nom. Pour revenir à votre espace parent, utilisez le bouton de déconnexion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
