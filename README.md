# Bluestacks API
A simple Express API to fetch, store and play most popular YouTube videos.
The API is currently hosted using Heroku at https://secure-forest-43886.herokuapp.com/.

## Instruction to Run the API
### Method 1: Locally

##### Clone the repository, install node packages
```
git clone https://github.com/shann-singh/bluestacks-api
cd bluestacks-api
create DB and table
npm install
npm start
```

### Method 2: Using Docker
```
git clone https://github.com/shann-singh/bluestacks-api
cd bluestacks-api
create DB and table
docker-compose build
docker-compose up
```

## API Endpoints

### 1) Fetch most popular videos from Youtube and save them into DB
```
POST /videos/fetch-popular

body : { 
          "maxResults": {10 to 50} 
       }
```

### 2) Get videos from DB (max 20 at a time)
```
GET /videos/fetch-popular?page={page_number}
```

### 3) Fetch a video's and its channel info from YouTube
```
GET /videos/video-details?videoID={videoID}
```