# Backend NutriHarmony

Backend Django pour l'application NutriHarmony avec authentification JWT.

## Configuration requise

- Python 3.8+
- pip
- virtualenv (recommandé)

## Installation

1. Créez et activez un environnement virtuel :
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Sur Windows
   source venv/bin/activate  # Sur macOS/Linux
   ```

2. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

3. Effectuez les migrations :
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. Créez un superutilisateur (optionnel) :
   ```bash
   python manage.py createsuperuser
   ```

5. Lancez le serveur de développement :
   ```bash
   python manage.py runserver
   ```

## API Endpoints

- `POST /api/auth/register/` - Enregistrement d'un nouvel utilisateur
- `POST /api/auth/token/` - Obtenir un token JWT (email et mot de passe)
- `POST /api/auth/token/refresh/` - Rafraîchir un token JWT
- `GET /api/auth/profile/` - Profil de l'utilisateur connecté (authentification requise)

## Configuration

Copiez le fichier `.env.example` vers `.env` et modifiez les variables selon vos besoins.

## Déploiement

Pour la production, assurez-vous de :
1. Modifier `DEBUG = False`
2. Configurer une base de données de production (PostgreSQL recommandé)
3. Configurer un serveur web comme Gunicorn ou uWSGI
4. Configurer un serveur web comme Nginx comme reverse proxy
