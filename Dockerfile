FROM node
COPY . /app
WORKDIR /app
RUN rm -rf node_modeles
RUN npm install && npm ls

# RUN npm rebuild bcrypt --build-from-source
# RUN mv /app/node_modules /node_modules

EXPOSE 5000
CMD ["node", "app.js"]