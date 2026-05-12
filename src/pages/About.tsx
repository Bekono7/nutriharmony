import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Heart, Users, Award, ChefHat, Shield, Target } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "100% Naturel",
      description: "Nous sélectionnons uniquement des ingrédients frais, biologiques et de saison pour garantir la meilleure qualité nutritionnelle."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Santé d'abord",
      description: "Chaque plat est conçu par notre équipe de diététiciens pour répondre à vos besoins nutritionnels spécifiques."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Communauté",
      description: "Nous croyons en l'importance de créer une communauté autour de l'alimentation saine et du bien-être."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Sécurité alimentaire",
      description: "Traçabilité complète et respect strict des normes d'hygiène pour votre sécurité."
    }
  ];

  const team = [
    {
      name: "Dr. Marie Dubois",
      role: "Diététicienne-nutritionniste",
      description: "15 ans d'expérience en nutrition clinique et sportive",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Chef Antoine Martin",
      role: "Chef exécutif",
      description: "Spécialisé en cuisine saine et gastronomique",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Sarah Johnson",
      role: "Diététicienne spécialisée",
      description: "Experte en allergies alimentaires et régimes spéciaux",
      image: "/api/placeholder/300/300"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Clients satisfaits" },
    { number: "500+", label: "Plats développés" },
    { number: "15", label: "Diététiciens experts" },
    { number: "98%", label: "Taux de satisfaction" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">À propos de NutriHarmony</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nous révolutionnons l'alimentation en proposant une expérience culinaire personnalisée, 
            alliant plaisir gustatif et bienfaits nutritionnels pour votre santé.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Notre mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Chez NutriHarmony, nous croyons que l'alimentation doit être à la fois délicieuse et bénéfique 
                pour la santé. Notre mission est de démocratiser l'accès à une nutrition personnalisée en 
                proposant des plats savoureux adaptés aux besoins spécifiques de chaque individu.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Que vous ayez des allergies alimentaires, suiviez un régime particulier ou poursuiviez des 
                objectifs de santé précis, nous mettons notre expertise au service de votre bien-être.
              </p>
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold">Certifié ISO 22000</h3>
                  <p className="text-sm text-muted-foreground">Sécurité alimentaire garantie</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="card-natural p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-center gap-4">
                  <Target className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Vision 2025</h3>
                    <p className="text-muted-foreground">
                      Devenir la référence en nutrition personnalisée au Cameroun et en Afrique Centrale
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="card-natural p-6 bg-gradient-to-br from-accent/5 to-primary/5">
                <div className="flex items-center gap-4">
                  <ChefHat className="h-10 w-10 text-accent" />
                  <div>
                    <h3 className="font-semibold text-lg">Excellence culinaire</h3>
                    <p className="text-muted-foreground">
                      Des chefs formés aux techniques de cuisine saine et gourmande
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nos valeurs</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ces principes guident chacune de nos actions et décisions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="card-natural text-center">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">{value.icon}</div>
                  <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">NutriHarmony en chiffres</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Notre équipe d'experts</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des professionnels passionnés au service de votre santé
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="card-natural text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer votre voyage vers une meilleure santé ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez notre communauté et découvrez comment une alimentation personnalisée 
            peut transformer votre bien-être.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="interactive">
                Créer mon profil santé
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="interactive border-white text-white hover:bg-white hover:text-primary">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;