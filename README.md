# Запуск локально

`npm ci; npm run start`

# Докер контейнер

`docker build -t radio:latest --build-args REACT_APP_API_ENDPOINT='адрес_сервера' . && docker run -it radio:latest`

# docker-compose

`docker-compose up`

# Переменные

`REACT_APP_API_ENDPOINT` - адрес сервера для панели администратора

Можно задать как в файле `.env`, так и в `docker-compose.yml` или напрямую через терминал
