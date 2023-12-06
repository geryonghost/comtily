FROM ubuntu as base

RUN apt-get update && \
apt-get install -y apache2 && \
apt-get install -y apache2-utils && \
apt-get clean && \
echo "Listen 8080" > /etc/apache2/ports.conf && \
echo "<VirtualHost *:8080>" > /etc/apache2/sites-available/000-default.conf && \
echo "  ServerName www.comtily.com" >> /etc/apache2/sites-available/000-default.conf && \
echo "  DocumentRoot /var/www/html" >> /etc/apache2/sites-available/000-default.conf && \
echo "</VirtualHost>" >> /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

COPY . .

EXPOSE 8080

# Start Apache in the foreground
CMD ["apache2ctl", "-D", "FOREGROUND"]