# Migración de Google Cloud a AWS

## Arquitectura Actual (Google Cloud)

- **Backend**: Cloud Run (FastAPI + YOLO)
- **Frontend**: Vercel (Next.js)

## Arquitectura Propuesta (AWS)

- **Backend**: Lambda Container (inicio) → ECS Fargate (si aumenta el uso)
- **Frontend**: Lightsail ($20/mes, instancia existente)

---

## Backend: Lambda Container

### Ventajas
- Pay-per-use (~$0 si poco uso)
- Escala automáticamente
- Sin gestión de servidores

### Limitaciones
- Cold starts: 10-30s con modelo YOLO grande
- Timeout máximo: 15 minutos
- RAM máxima: 10GB

### Archivos necesarios

#### `backend/Dockerfile.lambda`
```dockerfile
FROM public.ecr.aws/lambda/python:3.11

# Dependencias del sistema para OpenCV
RUN dnf install -y \
    mesa-libGL \
    glib2 \
    libSM \
    libXext \
    libXrender \
    && dnf clean all

# Instalar dependencias Python
COPY requirements.txt ${LAMBDA_TASK_ROOT}/
RUN pip install --no-cache-dir -r ${LAMBDA_TASK_ROOT}/requirements.txt mangum

# Copiar código
COPY . ${LAMBDA_TASK_ROOT}/

CMD ["handler.lambda_handler"]
```

#### `backend/handler.py`
```python
from mangum import Mangum
from main import app

lambda_handler = Mangum(app, lifespan="off")
```

#### `deploy/template.yaml` (AWS SAM)
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: GalloConta Backend API

Globals:
  Function:
    Timeout: 300
    MemorySize: 4096

Resources:
  GalloContaFunction:
    Type: AWS::Serverless::Function
    Properties:
      PackageType: Image
      Architectures:
        - x86_64
      Events:
        Api:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY
      Environment:
        Variables:
          BASIC_AUTH_USER: !Ref BasicAuthUser
          BASIC_AUTH_PASS: !Ref BasicAuthPass
          FTP_HOST: !Ref FtpHost
          FTP_USER: !Ref FtpUser
          FTP_PASS: !Ref FtpPass
    Metadata:
      Dockerfile: Dockerfile.lambda
      DockerContext: ../backend
      DockerTag: latest

Parameters:
  BasicAuthUser:
    Type: String
  BasicAuthPass:
    Type: String
    NoEcho: true
  FtpHost:
    Type: String
  FtpUser:
    Type: String
  FtpPass:
    Type: String
    NoEcho: true

Outputs:
  ApiUrl:
    Description: API Gateway URL
    Value: !Sub "https://${ServerlessHttpApi}.execute-api.${AWS::Region}.amazonaws.com"
```

### Despliegue

```bash
# Instalar AWS SAM CLI
pip install aws-sam-cli

# Build
cd deploy
sam build

# Deploy
sam deploy --guided
```

---

## Backend: ECS Fargate (migración futura)

### Cuándo migrar
- Cold starts inaceptables para usuarios
- Uso constante (más económico que Lambda con alto volumen)
- Necesidad de latencia consistente

### Coste estimado
- ~$15-30/mes para una task pequeña (0.5 vCPU, 1GB RAM)
- Más predecible que Lambda con uso alto

#### `deploy/docker-compose.prod.yml`
```yaml
services:
  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - BASIC_AUTH_USER=${BASIC_AUTH_USER}
      - BASIC_AUTH_PASS=${BASIC_AUTH_PASS}
      - FTP_HOST=${FTP_HOST}
      - FTP_USER=${FTP_USER}
      - FTP_PASS=${FTP_PASS}
      - KAGGLE_USERNAME=${KAGGLE_USERNAME}
      - KAGGLE_KEY=${KAGGLE_KEY}
    command: gunicorn --bind :8000 --workers 1 --threads 8 --timeout 0 main:app -k uvicorn.workers.UvicornWorker
    restart: unless-stopped
```

### Despliegue con ECS

```bash
# Crear repositorio ECR
aws ecr create-repository --repository-name galloconta-backend

# Login a ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build y push
docker build -t galloconta-backend ../backend
docker tag galloconta-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/galloconta-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/galloconta-backend:latest

# Crear cluster y servicio via AWS Console o CLI
```

---

## Frontend: Lightsail

### Configuración

1. Conectar a la instancia Lightsail
2. Instalar Node.js y npm
3. Clonar repositorio
4. Configurar variables de entorno
5. Build y servir con PM2 o similar

```bash
# En la instancia Lightsail
cd /var/www
git clone https://github.com/rminguell/galloconta.git
cd galloconta/frontend

# Instalar dependencias
npm install

# Configurar variables
echo "NEXT_PUBLIC_BACKEND_URL=https://<api-gateway-url>" > .env.local
echo "NEXT_PUBLIC_MAX_UPLOAD_MB=10" >> .env.local

# Build
npm run build

# Servir con PM2
npm install -g pm2
pm2 start npm --name "galloconta-frontend" -- start
pm2 save
pm2 startup
```

### Nginx como reverse proxy

```nginx
server {
    listen 80;
    server_name galloconta.app;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Comparativa de Costes

| Componente | Google Cloud | AWS (Lambda) | AWS (Fargate) |
|------------|--------------|--------------|---------------|
| Backend | Cloud Run ~$10-30/mes | ~$0-5/mes (bajo uso) | ~$15-30/mes |
| Frontend | Vercel (gratis/pro) | Lightsail $20/mes | Lightsail $20/mes |
| **Total** | ~$10-30/mes | ~$20-25/mes | ~$35-50/mes |

---

## Checklist de Migración

- [ ] Crear cuenta AWS (si no existe)
- [ ] Configurar AWS CLI y credenciales
- [ ] Crear repositorio ECR para imágenes Docker
- [ ] Desplegar backend en Lambda
- [ ] Configurar API Gateway con dominio personalizado
- [ ] Actualizar CORS en backend para nuevo dominio
- [ ] Configurar frontend en Lightsail
- [ ] Configurar SSL/HTTPS
- [ ] Actualizar DNS
- [ ] Probar flujo completo
- [ ] Migrar variables de entorno (FTP, Kaggle, etc.)
