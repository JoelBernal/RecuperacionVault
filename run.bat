@echo off
del /f /q "database.sqlite"
start cmd /k "npm run db:init"
start cmd /k "npm run www"
