echo '\nPreparando banco de dados de teste\n'
sudo docker pull postgres
sudo docker run --name=postgres -p 5432:5432 -e POSTGRES_PASSWORD='21392996' -e POSTGRES_USER='risqlac' -e POSTGRES_DB='risqlacdb' -d postgres:latest
