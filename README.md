# WeebRaphael - Anime Recommendation Platform

A full-stack application for anime recommendations, built with FastAPI and React.

## Project Structure

```
weebRaphael/
├── Backend/           # FastAPI backend
│   ├── requirements.txt
│   └── ...
└── frontend/         # React frontend
    ├── package.json
    └── ...
```

## Backend Setup

1. Create a virtual environment:

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:
   Create a `.env` file in the Backend directory with:

```
DATABASE_URL=postgresql://user:password@localhost:5432/weebraphael
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

4. Run the backend:

```bash
uvicorn main:app --reload
```

## Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:8000
```

3. Run the development server:

```bash
npm run dev
```

## Deployment

### Frontend (Netlify)

1. Create a new site on Netlify:

   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose your repository
   - Select the `frontend` directory as the base directory

2. Configure build settings:

   - Build command: `npm run build`
   - Publish directory: `dist`

3. Set up environment variables in Netlify:

   - Go to Site settings > Build & deploy > Environment
   - Add the following environment variable:
     - `VITE_API_URL`: Your backend API URL

4. Deploy:
   - Netlify will automatically deploy your site when you push to your repository
   - You can also trigger manual deploys from the Netlify dashboard

### Backend (Your preferred hosting)

The backend can be deployed to any hosting service that supports Python applications, such as:

- Heroku
- DigitalOcean
- AWS
- Google Cloud Platform

Make sure to:

1. Set up all required environment variables
2. Configure CORS to allow requests from your frontend domain
3. Set up a PostgreSQL database
4. Configure Redis for caching

## Features

- User authentication and authorization
- Anime recommendations based on user preferences
- Favorite anime management
- Watched anime tracking
- User profile management
- Admin dashboard for user management

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Redis
- JWT Authentication
- Pydantic
- scikit-learn (for recommendations)

### Frontend

- React
- TypeScript
- Chakra UI
- React Query
- React Router
- Axios

## Development

- Backend API documentation: http://localhost:8000/docs
- Frontend development server: http://localhost:5173

## Testing

Backend tests:

```bash
cd Backend
pytest
```

Frontend type checking:

```bash
cd frontend
npm run type-check
```

## License

MIT
