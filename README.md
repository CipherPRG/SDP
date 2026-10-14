# SDP — Family Members Form (Flask)

A web form to add family member details with client-side validation, served using Python and Flask.

## Features

- Add family members with name, relationship, DOB, gender, PAN, Aadhaar, mobile, email, occupation, income, address and PIN code
- Live validation with error messages (PAN format, Aadhaar, mobile, PIN, duplicates, etc.)
- Added members shown as cards, with Aadhaar masked
- Remove members, success toast, responsive layout

## Technologies Used

- Python
- Flask
- HTML
- CSS
- JavaScript
- Docker

## Project Structure

```text
SDP/
├── app.py
├── requirements.txt
├── Dockerfile
├── .dockerignore
├── .gitignore
├── README.md
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/CipherPRG/SDP.git
cd SDP
git checkout E-Survey
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

### 3. Activate the virtual environment

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the application

```bash
python app.py
```

Open your browser and visit:

http://127.0.0.1:5000

## Available Routes

| Route | Description |
|---|---|
| `/` | Family Members form |

## Docker

### Build the image

```bash
docker build -t family-members-flask .
```

### Run the container

```bash
docker run -p 5000:5000 family-members-flask
```

Open http://127.0.0.1:5000

## Author

Pratham Rampurmath
