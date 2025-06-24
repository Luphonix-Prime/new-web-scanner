FROM httpd:2.4
COPY ./index.html /usr/local/apache2/htdocs/
COPY ./styles.css /usr/local/apache2/htdocs/
COPY ./script.js /usr/local/apache2/htdocs/
copy ./demo.html /usr/local/apache2/htdocs/
COPY ./white_logo-removebg-preview.png /usr/local/apache2/htdocs/