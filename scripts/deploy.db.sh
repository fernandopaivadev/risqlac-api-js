sudo docker pull postgres
sudo docker run --name=postgres -p 5432:5432 -e POSTGRES_PASSWORD='risqlac' -e POSTGRES_USER='risqlac' -e POSTGRES_DB='risqlacdb' -d postgres:latest
