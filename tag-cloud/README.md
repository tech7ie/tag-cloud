# tag-word

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

-----------------------------------------------------------------

### Применить dump
docker-compose exec  db psql -U postgres -d cloudtags -f /docker-entrypoint-initdb.d/dump.sql