@echo off

docker compose up -d

start http://localhost:5173

pause

docker compose down
