from pathlib import Path
from decouple import config
from datetime import timedelta
import os
from django.conf import settings

# Base directory path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Secret key for the project (use environment variables for security)
SECRET_KEY = config('SECRET_KEY')

# Debug flag, controlled via environment variable
DEBUG = config('DEBUG', default=False, cast=bool)

# Permitir apenas o domínio correto acessar o servidor
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '10.173.82.117',  # Para desenvolvimento local
    '192.168.1.8',
        # Para desenvolvimento local
]  # In production, replace with your domain e.g., ['myfrontend.com']

# Database configuration, using MySQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}

# Installed apps, including Django, Rest Framework, CORS, and your core app
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',  # For API development
    'rest_framework_simplejwt',  # For JWT authentication
    'core',  # Your custom app
    'corsheaders',  # To handle Cross-Origin Resource Sharing (CORS)
    'django_extensions',  # Optional tools and extensions for development
]

# Middleware to manage requests, responses, and CORS
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Enables CORS headers
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Django REST framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # Use JWT for token-based auth
    ],
    # 'DEFAULT_PERMISSION_CLASSES': (
    #     'rest_framework.permissions.IsAuthenticated',
    # ),
}

# Authentication backends for user login
AUTHENTICATION_BACKENDS = [
    'core.backends.EmailBackend',  # Custom email login backend
    'django.contrib.auth.backends.ModelBackend',
]

# JWT (JSON Web Token) configuration
SIMPLE_JWT = {
    'SIGNING_KEY': config('JWT_SIGNING_KEY', default=config('SECRET_KEY')),
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ALGORITHM': 'HS256',  # Use 'RS256' para assinatura assimétrica
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'JTI_CLAIM': 'jti',
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'uuid',  # Use 'uuid' em vez de 'id'
    'USER_ID_CLAIM': 'uuid',  # O claim será 'uuid' em vez de 'user_id'
}

# CORS configuration: Allow only specific origins in production
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Localhost development
    "http://127.0.0.1:3000",  # Localhost development (IP)
    "http://10.173.82.117:3000",
    "http://192.168.1.8:3000",
]
# Uncomment the following line for production, and comment the `CORS_ALLOWED_ORIGINS`
# CORS_ALLOW_ALL_ORIGINS = False  # Allows only specified origins

# Root URL configuration
ROOT_URLCONF = 'backend.urls'

# Template configuration for rendering HTML pages
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # You can add custom template directories here
        'APP_DIRS': True,  # Django will automatically discover templates in each app
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI application (for deployment)
WSGI_APPLICATION = 'backend.wsgi.application'

# Password validation, as recommended by Django for security
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Language and timezone configuration
LANGUAGE_CODE = 'pt-br'  # Language set to Brazilian Portuguese
TIME_ZONE = 'America/Sao_Paulo'  # Time zone set to São Paulo

USE_I18N = True  # Enables internationalization
USE_TZ = True  # Enables time zone support

# Static files (CSS, JavaScript, Images) configuration
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'core.Usuario'  # Using a custom user model in the core app

# Media files (for user-uploaded content)
MEDIA_URL = '/media/'  # URL for serving media files
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # Directory to store media files

# Application logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{asctime} {levelname} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'django_requests.log'),
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['file', 'console', 'mail_admins'],
            'level': 'ERROR',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': False,
        },
        'django.security': {
            'handlers': ['file', 'console'],
            'level': 'WARNING',
            'propagate': False,
        },
        'myapp.views': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'critical': {
            'handlers': ['file', 'console'],
            'level': 'CRITICAL',
            'propagate': False,
        },
    },
}
