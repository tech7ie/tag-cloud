# Используем официальный образ Node.js в качестве базового
FROM node:20-alpine

# Создаём директорию приложения
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
# Дополнительно устанавливаем TypeScript локально в проект
RUN npm install typescript --save-dev

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Открываем 3000 порт для внешних подключений
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run","start"]
