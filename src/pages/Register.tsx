import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Eye, EyeOff, Mail, Lock, User, CheckCircle, Calendar, HeartPulse, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    tribe: "",
    healthInfo: "",
    allergies: ""
  });
  
  const tribes = [
    "Bamoun", "Bamiléké", "Bassa", "Béti", "Douala", "Bakweri", "Bakossi", 
    "Bulu", "Ewondo", "Fang", "Tikar", "Maka", "Pygmée", "Autre"
  ];
  
  const genderOptions = [
    { value: "male", label: "Masculin" },
    { value: "female", label: "Féminin" },
    { value: "other", label: "Autre" },
    { value: "prefer_not_to_say", label: "Préfère ne pas dire" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await auth.register({
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
        additional_data: {
          age: formData.age,
          gender: formData.gender,
          tribe: formData.tribe,
          health_info: formData.healthInfo,
          allergies: formData.allergies
        }
      });

      // Afficher un message de succès
      toast({
        title: 'Inscription réussie',
        description: 'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
      });

      // Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      let errorMessage = 'Une erreur est survenue lors de l\'inscription';
      
      if (err.response) {
        // Erreur de validation du serveur
        if (err.response.data) {
          const { data } = err.response;
          
          if (typeof data === 'object') {
            // Gestion des erreurs de validation détaillées
            const errorMessages = Object.entries(data)
              .map(([field, errors]) => {
                if (Array.isArray(errors)) {
                  return `${field}: ${errors.join(', ')}`;
                }
                return `${field}: ${errors}`;
              })
              .join('\n');
            
            if (errorMessages) {
              errorMessage = errorMessages;
            } else if (data.detail) {
              errorMessage = data.detail;
            }
          } else if (typeof data === 'string') {
            errorMessage = data;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const benefits = [
    "Menu adapté à vos allergies et régimes",
    "Recommandations nutritionnelles personnalisées",
    "Suivi de vos objectifs de santé",
    "Accès à notre équipe de diététiciens"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="hidden lg:block space-y-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-primary mb-8">
              <Leaf className="h-8 w-8" />
              <span className="text-2xl font-bold text-gradient">NutriHarmony</span>
            </Link>
            <h2 className="text-3xl font-bold mb-4">
              Rejoignez la révolution nutritionnelle
            </h2>
            <p className="text-lg text-muted-foreground">
              Créez votre profil santé et découvrez une alimentation personnalisée qui vous ressemble.
            </p>
          </div>
          
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6">
            <h3 className="font-semibold mb-2">💡 Le saviez-vous ?</h3>
            <p className="text-sm text-muted-foreground">
              Une alimentation personnalisée peut améliorer votre bien-être de 40% selon nos études internes.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="card-natural animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Créer votre compte</CardTitle>
              <CardDescription>
                Quelques minutes pour une alimentation sur mesure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Votre nom"
                        className="pl-10"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Votre prénom"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                 
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Âge</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          min="1"
                          max="120"
                          placeholder="Votre âge"
                          className="pl-10"
                          value={formData.age}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Sexe</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => handleSelectChange("gender", value)}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionnez votre sexe" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tribe">Tribu / Groupe ethnique</Label>
                    <Select
                      value={formData.tribe}
                      onValueChange={(value) => handleSelectChange("tribe", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre tribu ou groupe ethnique" />
                      </SelectTrigger>
                      <SelectContent>
                        {tribes.map((tribe) => (
                          <SelectItem key={tribe} value={tribe}>
                            {tribe}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum 8 caractères avec des chiffres et des lettres
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="healthInfo">
                      <div className="flex items-center gap-2">
                        <HeartPulse className="h-4 w-4 text-muted-foreground" />
                        Informations de santé (optionnel)
                      </div>
                    </Label>
                    <Textarea
                      id="healthInfo"
                      name="healthInfo"
                      placeholder="Maladies chroniques, conditions particulières, etc."
                      className="min-h-[80px]"
                      value={formData.healthInfo}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allergies">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        Allergies alimentaires (séparées par des virgules)
                      </div>
                    </Label>
                    <Input
                      id="allergies"
                      name="allergies"
                      type="text"
                      placeholder="Ex: Arachides, fruits de mer, lactose, etc."
                      value={formData.allergies}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Ces informations nous aident à personnaliser vos recommandations alimentaires.
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="text-xs text-muted-foreground">
                    En créant un compte, vous acceptez nos{" "}
                    <Link to="/terms" className="text-primary hover:text-primary-hover">
                      conditions d'utilisation
                    </Link>{" "}
                    et notre{" "}
                    <Link to="/privacy" className="text-primary hover:text-primary-hover">
                      politique de confidentialité
                    </Link>
                    .
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full btn-hero"
                    size="lg"
                  >
                    Créer mon compte
                  </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-border"></div>
                <span className="px-4 text-sm text-muted-foreground">ou</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  Déjà un compte ?{" "}
                  <Link 
                    to="/login" 
                    className="font-medium text-primary hover:text-primary-hover transition-colors"
                  >
                    Se connecter
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;