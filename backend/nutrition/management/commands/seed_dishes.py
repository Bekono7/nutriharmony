from decimal import Decimal

from django.core.management.base import BaseCommand

from nutrition.models import Dish


DISHES = [
    {
        "name": "Ndolé aux Crevettes",
        "description": "Plat national camerounais avec feuilles de ndolé, crevettes, bœuf maigre et arachides",
        "price": Decimal("4500"),
        "category": Dish.Category.PLATS,
        "calories": 520,
        "proteins": Decimal("35"),
        "badges": ["Riche en Protéines", "Sans Gluten"],
    },
    {
        "name": "Poulet DG Revisité",
        "description": "Poulet grillé avec plantains, légumes vapeur et riz complet",
        "price": Decimal("3800"),
        "category": Dish.Category.PLATS,
        "calories": 480,
        "proteins": Decimal("32"),
        "badges": ["Riche en Protéines", "Sans Gluten"],
    },
    {
        "name": "Poisson Braisé Santé",
        "description": "Tilapia grillé avec plantains, légumes sautés et sauce tomate épicée",
        "price": Decimal("3500"),
        "category": Dish.Category.PLATS,
        "calories": 390,
        "proteins": Decimal("28"),
        "badges": ["Riche en Protéines", "Sans Gluten"],
    },
    {
        "name": "Smoothie Bissap Gingembre",
        "description": "Bissap, gingembre frais, citron vert et miel pour une boisson rafraîchissante",
        "price": Decimal("1500"),
        "category": Dish.Category.BOISSONS,
        "calories": 120,
        "proteins": Decimal("2"),
        "badges": ["Végan", "Sans Gluten"],
    },
    {
        "name": "Salade de Haricots Verts",
        "description": "Haricots verts, tomates, avocat, oignon et vinaigrette à l'huile de palme",
        "price": Decimal("2200"),
        "category": Dish.Category.ENTREES,
        "calories": 180,
        "proteins": Decimal("6"),
        "badges": ["Végan", "Sans Gluten"],
    },
    {
        "name": "Salade de Fruits Tropicaux",
        "description": "Ananas, mangue, papaye, banane et noix de coco râpée avec miel",
        "price": Decimal("1800"),
        "category": Dish.Category.DESSERTS,
        "calories": 220,
        "proteins": Decimal("3"),
        "badges": ["Végan", "Sans Gluten"],
    },
]


class Command(BaseCommand):
    help = "Crée les plats de démonstration (idempotent par nom)."

    def handle(self, *args, **options):
        created = 0
        for row in DISHES:
            _, was_created = Dish.objects.get_or_create(
                name=row["name"],
                defaults={
                    "description": row["description"],
                    "price": row["price"],
                    "category": row["category"],
                    "calories": row["calories"],
                    "proteins": row["proteins"],
                    "badges": row["badges"],
                },
            )
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f"Plats créés : {created} (ignorés si déjà présents)."))
