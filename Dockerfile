# builder container for django app with build dependencies
FROM python:3.7-slim AS backend-builder

RUN set -ex \
    && apt-get update \
    && apt-get install build-essential --no-install-recommends -y \
    && pip install pipenv

ADD ./backend/Pipfile /Pipfile
ADD ./backend/Pipfile.lock /Pipfile.lock

RUN set -ex \
    && pipenv install --system --deploy \
    && pip install uwsgi==2.0.17

# builder container for vue.js frontend app
FROM node:alpine AS frontend-builder

RUN mkdir /app
COPY ./frontend /app
WORKDIR /app
RUN set -ex && apk add python make g++
RUN set -ex && yarn && yarn build

# create new container without build dependencies
FROM python:3.7-slim

# copy site-packages with compiled binaries from builder container
COPY --from=backend-builder /usr/local/lib/python3.7/site-packages /usr/local/lib/python3.7/site-packages
COPY --from=backend-builder /usr/local/bin/uwsgi /usr/local/bin/uwsgi

# copy code into container
RUN mkdir /code
ADD ./backend/ /code/

WORKDIR /code
RUN DJANGO_SECRET_KEY=none DEBUG=False python manage.py collectstatic --noinput

COPY --from=frontend-builder /app/dist/static /static
COPY --from=frontend-builder /app/dist/index.html /code/backend/templates/
COPY --from=frontend-builder /app/dist/favicon.ico /static/favicon.ico

RUN mkdir /uploads
RUN chown 1000 /uploads

ADD ./deploy/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod a+x /docker-entrypoint.sh

EXPOSE 8000

ENV DEBUG False
ENV UWSGI_WSGI_FILE=/code/stormnotes/wsgi.py UWSGI_HTTP=:8000 UWSGI_MASTER=1 UWSGI_WORKERS=2 UWSGI_THREADS=8 UWSGI_UID=1000 UWSGI_GID=2000 UWSGI_LAZY_APPS=1 UWSGI_WSGI_ENV_BEHAVIOR=holy

CMD ["/docker-entrypoint.sh"]
