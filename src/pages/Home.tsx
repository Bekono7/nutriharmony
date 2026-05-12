import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, Users, Star, ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-camerounais.jpg";

const Home = () => {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-primary" />,
      title: "Personnalisation complète",
      description: "Menu adapté à vos allergies, régimes et objectifs de santé"
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Équipe de diététiciens",
      description: "Suivi par nos professionnels de la nutrition"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Communauté active",
      description: "Rejoignez des milliers de personnes qui prennent soin de leur santé"
    }
  ];

  const testimonials = [
    {
      name: "Marie L.",
      rating: 5,
      comment: "Enfin un restaurant qui comprend mes allergies ! Les plats sont délicieux et parfaitement adaptés."
    },
    {
      name: "Thomas D.",
      rating: 5,
      comment: "Grâce à NutriHarmony, j'ai atteint mes objectifs de prise de masse tout en me régalant."
    },
    {
      name: "Sophie M.",
      rating: 5,
      comment: "Une révolution dans ma façon de manger. L'équipe de diététiciens est fantastique !"
    }
  ];

  const benefits = [
    "Menu personnalisé selon votre profil",
    "Ingrédients frais et de qualité",
    "Livraison rapide et éco-responsable",
    "Suivi nutritionnel professionnel"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-in">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Une alimentation saine,{" "}
                <span className="text-gradient">personnalisée pour vous</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Découvrez une nouvelle façon de vous nourrir avec des plats adaptés à vos besoins, 
                allergies et objectifs de santé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/menu">
                  <Button size="lg" className="btn-hero">
                    Découvrir le menu
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg" className="interactive border-primary text-primary hover:bg-primary hover:text-white">
                    Créer mon profil
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src={heroImage}
                alt="Plat sain et équilibré"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="font-medium text-sm">100% naturel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir NutriHarmony ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nous révolutionnons votre expérience culinaire avec une approche scientifique et personnalisée
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-natural text-center">
                <CardContent className="p-8">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                L'expérience NutriHarmony
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-block mt-8">
                <Button size="lg" className="btn-hero">
                  Commencer maintenant
                </Button>
              </Link>
            </div>
            <div className="space-y-6">
              <Card className="card-natural p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                <h3 className="font-semibold text-lg mb-3">✨ Profil personnalisé</h3>
                <p className="text-muted-foreground">
                  Créez votre profil santé en quelques minutes et recevez des recommandations sur mesure.
                </p>
              </Card>
              <Card className="card-natural p-6 bg-gradient-to-br from-accent/5 to-primary/5">
                <h3 className="font-semibold text-lg mb-3">🎯 Objectifs clairs</h3>
                <p className="text-muted-foreground">
                  Que ce soit pour perdre du poids, prendre du muscle ou simplement rester en forme.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-muted-foreground">
              Découvrez les témoignages de notre communauté
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-natural">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <p className="font-medium">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à transformer votre alimentation ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez des milliers de personnes qui ont déjà adopté une alimentation saine et personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="interactive">
                Créer mon compte gratuitement
              </Button>
            </Link>
            <Link to="/menu">
              <Button size="lg" variant="outline" className="interactive border-white text-white hover:bg-white hover:text-primary">
                Voir le menu
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;