@echo off

docker compose up --build

start http://localhost:5173

pause

docker compose down
