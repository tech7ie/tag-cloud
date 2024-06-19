### Применить dump
docker-compose exec  db psql -U postgres -d cloudtags -f /docker-entrypoint-initdb.d/dump.sql