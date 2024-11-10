run:
	python3 manage.py runserver

start_db:
	mongod --dbpath db/data --logpath db/logs/mongodb.log

start_db_fork:
	mongod --dbpath db/data --logpath db/logs/mongodb.log --fork

make_migration:
	python3 manage.py makemigrations

migrate:
	python3 manage.py migrate