import multiprocessing

# Nombre de workers Gunicorn (généralement 2-4 x nombre de cœurs CPU)
workers = multiprocessing.cpu_count() * 2 + 1

# Nom du module WSGI
wsgi_app = "config.wsgi:application"

# Adresse et port d'écoute
bind = "0.0.0.0:8000"

# Mode d'exécution (désactiver en développement)
reload = False

# Niveau de journalisation
loglevel = "info"

# Fichiers de logs
accesslog = "./logs/access.log"
errorlog = "./logs/error.log"

# Nombre maximum de requêtes qu'un worker traitera avant d'être redémarré
max_requests = 1000
max_requests_jitter = 50

# Timeout en secondes
timeout = 120

# Nombre maximum de requêtes simultanées par worker (par défaut 1000)
worker_connections = 1000

# Nombre de threads par worker (utilisé avec le worker 'gthread')
threads = 2
worker_class = "gthread"
