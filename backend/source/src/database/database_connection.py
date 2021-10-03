from flask.json import jsonify
from peewee import PostgresqlDatabase, TextField, IntegerField, SQL, Model, CharField
import uuid

class DatabaseConnection:
    def __init__(self) -> None:
        self.db_name = "demo"
        self.db_user="postgres"
        self.db_password="postgres"
        self.db_host="postgres_agile"
        self.Task = None
        self.create_db()

    def create_db(self):
        db = PostgresqlDatabase('demo', host=self.db_host, port=5432, user='postgres', password='postgres')
       
        class Task (Model):
            uuid=CharField(primary_key=True)
            title=TextField()
            sequence=IntegerField()
            status=IntegerField()
            class Meta:
                database = db
                db_table='task'

        db.connect()
        # db.drop_tables([Task])
        print('creating tables')
        db.create_tables([Task])
        self.Task = Task

        
    def create(self, taskDTO):
        generated_uuid=uuid.uuid4()
        self.Task.create(uuid=generated_uuid,title=taskDTO['title'], sequence=taskDTO['sequence'], status=taskDTO['status'])
        return self.read_one(generated_uuid)
    
    def update(self, taskDTO):
        self.Task(uuid=taskDTO['uuid'],title=taskDTO['title'], sequence=taskDTO['sequence'], status=taskDTO['status']).save()
        return self.read_one(taskDTO['uuid'])

    def read_one(self, key):
        return self.Task.select().where(self.Task.uuid == key).dicts().get() 

    def read_all(self, args):
        return list(self.Task.select().dicts())

    def delete(self, taskDTO):
        obj=self.Task.get(self.Task.uuid==taskDTO['uuid'])
        obj.delete_instance()
        return {"status":"OK"}

