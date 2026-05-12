"""
API (extrait) :
- POST /api/auth/register/  |  POST /api/auth/token/  |  POST /api/auth/token/refresh/
- GET/PATCH /api/auth/profile/
- GET/PATCH/DELETE /api/health-profile/
- GET/POST /api/dishes/  |  GET/PATCH/DELETE /api/dishes/{id}/
- GET/POST /api/meal-plans/  |  GET/PATCH/DELETE /api/meal-plans/{id}/
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('nutrition.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
