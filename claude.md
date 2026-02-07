# GalloConta

AI-powered crane counting application for Laguna de Gallocanta.

## Project Structure

This project follows Clean Architecture in both backend and frontend.

```
galloconta/
├── backend/                       # Backend (FastAPI)
│   ├── main.py                   # Application entry point
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py             # Settings: model config, folders, CORS
│   ├── domain/
│   │   ├── entities/
│   │   │   └── prediction.py     # PredictionResult dataclass
│   │   └── ports/
│   │       ├── predictor.py      # Predictor protocol
│   │       └── storage.py        # FileStorage, FeedbackStorage, ModelRepository protocols
│   ├── application/
│   │   └── use_cases/
│   │       ├── predict_image.py  # Image prediction use case
│   │       ├── submit_feedback.py # Feedback submission use case
│   │       └── update_model.py   # Model update use case
│   ├── infrastructure/
│   │   ├── ml/
│   │   │   ├── model_loader.py   # KaggleModelLoader: downloads model from Kaggle Hub
│   │   │   └── yolo_predictor.py # YOLOPredictor: YOLO inference implementation
│   │   ├── persistence/
│   │   │   ├── file_storage.py   # LocalFileStorage: local file operations
│   │   │   └── platform_storage.py # PlatformFeedbackStorage: uploads feedback images to galloconta-platform API
│   │   └── security/
│   │       └── basic_auth.py     # HTTP Basic authentication
│   └── presentation/
│       ├── dependencies.py       # FastAPI dependency injection
│       ├── schemas/
│       │   └── responses.py      # Pydantic response models
│       └── routers/
│           ├── upload.py         # POST /upload, GET /input/{file}, GET /output/{file}
│           ├── feedback.py       # POST /feedback
│           └── update.py         # GET /update (protected)
│
├── frontend/                      # Frontend (Next.js 15)
│   ├── app/
│   │   └── [locale]/             # i18n dynamic routing
│   │       ├── layout.tsx        # Root layout with analytics
│   │       ├── page.tsx          # Home page
│   │       └── globals.css       # Global styles
│   ├── core/
│   │   └── config.ts             # Environment configuration
│   ├── domain/
│   │   ├── entities/
│   │   │   └── prediction.ts     # PredictionResult interface
│   │   └── ports/
│   │       └── prediction-service.ts # Service interfaces
│   ├── application/
│   │   └── hooks/
│   │       ├── use-prediction.ts # Prediction hook with loading state
│   │       └── use-feedback.ts   # Feedback submission hook
│   ├── infrastructure/
│   │   └── api/
│   │       ├── api-client.ts     # Base HTTP client
│   │       ├── prediction-api.ts # Prediction API calls
│   │       └── feedback-api.ts   # Feedback API calls
│   ├── presentation/
│   │   └── components/
│   │       ├── features/
│   │       │   ├── uploader.tsx       # Main image upload component
│   │       │   ├── feedback-form.tsx  # Like/dislike feedback modal
│   │       │   ├── adjust-params.tsx  # Sensitivity/duplicates sliders
│   │       │   └── language-switcher.tsx # EN/ES language toggle
│   │       └── ui/
│   │           └── zoomable-image.tsx # Image with zoom capability
│   ├── i18n/                     # Internationalization config
│   ├── locales/                  # Translation files (en.json, es.json)
│   ├── middleware.ts             # i18n middleware
│   └── [config files]            # next.config.js, tailwind.config.js, etc.
│
├── training/                      # Reserved for model training code
│   └── .gitkeep
│
├── requirements.txt               # Python dependencies
├── Procfile                       # Cloud Run: gunicorn backend.main:app
├── cloudbuild.yaml               # Google Cloud Build pipeline
├── README.md                     # Project documentation
└── claude.md                     # This file
```

## Backend (FastAPI)

### Clean Architecture Layers

1. **core/**: Configuration and constants
   - `config.py`: Model settings, folder paths, CORS origins

2. **domain/**: Business logic contracts
   - `entities/`: Data structures (PredictionResult)
   - `ports/`: Interfaces defining what infrastructure must implement

3. **application/**: Use cases
   - `PredictImageUseCase`: Orchestrates image upload and prediction
   - `SubmitFeedbackUseCase`: Handles user feedback and uploads to galloconta-platform API
   - `UpdateModelUseCase`: Downloads latest model from Kaggle

4. **infrastructure/**: External implementations
   - `ml/`: Machine learning (YOLO inference, Kaggle model loading)
   - `persistence/`: Storage (local files, galloconta-platform API)
   - `security/`: Authentication (HTTP Basic)

5. **presentation/**: HTTP API
   - `routers/`: FastAPI endpoints
   - `schemas/`: Request/response models
   - `dependencies.py`: Dependency injection setup

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/upload` | POST | Upload image for crane detection |
| `/input/{filename}` | GET | Retrieve uploaded image |
| `/output/{filename}` | GET | Retrieve processed image |
| `/feedback` | POST | Submit like/dislike feedback |
| `/update` | GET | Update model (requires auth) |

### Entry Point

`backend/main.py` exports `app` (FastAPI instance). Referenced by Procfile as `backend.main:app`.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `BASIC_AUTH_USER` | Username for /update endpoint |
| `BASIC_AUTH_PASS` | Password for /update endpoint |
| `PLATFORM_API_URL` | galloconta-platform API base URL |
| `PLATFORM_API_TOKEN` | Bearer token for galloconta-platform API |

## Frontend (Next.js)

### Clean Architecture Layers

1. **core/**: Application configuration
   - `config.ts`: Environment variables typed

2. **domain/**: Business types
   - `entities/`: TypeScript interfaces
   - `ports/`: Service contracts

3. **application/**: Business logic
   - `hooks/`: React hooks encapsulating use cases

4. **infrastructure/**: External services
   - `api/`: HTTP client and API implementations

5. **presentation/**: UI layer
   - `components/features/`: Feature-specific components
   - `components/ui/`: Reusable UI primitives

### Key Features

- Internationalization with next-intl (Spanish/English)
- Drag & drop image upload
- Adjustable detection parameters (sensitivity, duplicate removal)
- Image zoom preview
- User feedback collection

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL |
| `NEXT_PUBLIC_MAX_UPLOAD_MB` | Maximum upload size in MB |

## Development

### Backend (Docker)

```bash
cd deploy
docker compose -f docker-compose.local.yml up --build
```

Backend runs at: **http://localhost:8000**

API docs available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

#### Test Endpoints

```bash
# Health check (upload form)
curl http://localhost:8000/docs

# Upload image for detection
curl -X POST http://localhost:8000/upload \
  -F "file=@image.jpg" \
  -F "confidence=0.5" \
  -F "iou=0.5"

# Get input image
curl http://localhost:8000/input/{filename}

# Get output image (with detections)
curl http://localhost:8000/output/{filename}

# Submit feedback
curl -X POST http://localhost:8000/feedback \
  -F "filename={filename}" \
  -F "feedback=like"

# Update model (requires auth)
curl -u admin:admin http://localhost:8000/update
```

### Backend (without Docker)

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Or with pnpm:

```bash
cd frontend
pnpm install
pnpm dev
```

## Deployment

### Backend (Google Cloud Run)

Despliegue automático via Cloud Build triggers:

| Rama | Servicio | URL |
|------|----------|-----|
| `main` | galloconta | https://galloconta-419024990899.europe-southwest1.run.app |
| `dev` | galloconta-dev | https://galloconta-dev-419024990899.europe-southwest1.run.app |

Al hacer `git push` a cualquiera de estas ramas, Cloud Build construye y despliega automáticamente.

- Build: `cloudbuild.yaml`
- Runtime: `Procfile` with gunicorn + uvicorn worker

### Frontend (Vercel)

- Config: `vercel.json`
- Build: `pnpm turbo build`

## Model

- **Name**: GRULLA
- **Architecture**: YOLOv11 (Ultralytics)
- **Source**: Kaggle Hub (`rminguell/grulla/pyTorch/default`)
- **Purpose**: Common crane (Grus grus) detection
- **Input**: Images up to 2048px
- **Output**: Bounding boxes with confidence scores

## Git Commits

Commits must be signed exclusively by the repository owner. Do not add Co-Authored-By headers.
