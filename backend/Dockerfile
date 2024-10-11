# Dockerfile for backend
FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

# Certifique-se de que as bibliotecas necessárias para o MySQL estão instaladas
RUN apt-get update && apt-get install -y default-libmysqlclient-dev gcc

COPY . .

# Executar as migrações e iniciar o servidor
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
