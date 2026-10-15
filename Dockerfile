# Site Saraiva Design — imagem para o Easypanel (ou qualquer servidor com Docker).
# 1) Gera o site estático com Astro  2) Serve com Apache + PHP (formulário de contato e .htaccess).

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM php:8.3-apache
# Módulos usados pelo .htaccess + msmtp para o formulário enviar e-mail via SMTP
RUN a2enmod rewrite headers deflate \
 && sed -ri 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf \
 && apt-get update \
 && apt-get install -y --no-install-recommends msmtp ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && echo 'sendmail_path = "/usr/bin/msmtp -t"' > /usr/local/etc/php/conf.d/mail.ini

COPY --from=build /app/dist/ /var/www/html/
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["apache2-foreground"]
