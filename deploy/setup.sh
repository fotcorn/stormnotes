docker-compose -f deploy/docker-compose-local.yaml exec stormnotes python /code/manage.py migrate
docker-compose -f deploy/docker-compose-local.yaml exec stormnotes python /code/manage.py createsuperuser
