FROM node:16.13.2-alpine as build-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
ARG REACT_APP_API_ENDPOINT
RUN echo "Endpoint: $REACT_APP_API_ENDPOINT"
RUN npm run build

FROM nginx:alpine
COPY ./proxy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]