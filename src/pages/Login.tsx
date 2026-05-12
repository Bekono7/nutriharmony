import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/";
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await login(formData.email, formData.password);
      
      // Afficher un message de succès
      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté.',
      });
      
      // Rediriger vers la page précédente ou la page d'accueil
      navigate(from, { replace: true });
      
    } catch (err: any) {
      let errorMessage = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
      
      if (err.response) {
        // Erreur de l'API
        if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast({
        title: 'Erreur de connexion',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary">
            <Leaf className="h-8 w-8" />
            <span className="text-2xl font-bold text-gradient">NutriHarmony</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="card-natural animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Bon retour !</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre menu personnalisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary-hover transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit Button */}
              {error && (
                <div className="text-destructive text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full btn-hero"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-sm text-muted-foreground">ou</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link 
                  to="/register" 
                  className="font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Créer un compte
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Reminder */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            En vous connectant, vous accédez à :
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <span className="bg-white/80 px-3 py-1 rounded-full">🎯 Menu personnalisé</span>
            <span className="bg-white/80 px-3 py-1 rounded-full">🥗 Recommandations santé</span>
            <span className="bg-white/80 px-3 py-1 rounded-full">📊 Suivi nutritionnel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;