from flask import request, jsonify
from database.database_connection import DatabaseConnection

class Api:
    def __init__(self, app) -> None:
        self.db = DatabaseConnection()
        self.setup_rest_api_endpoints(app)

    def setup_rest_api_endpoints(self, app):
        api_endpoint = "/api/v1/"

        @app.route(api_endpoint+'tasks', methods = ['POST', 'GET', 'PUT'])
        def login():
            if request.method == 'POST':
                return jsonify(self.db.create(request.json))
            
            elif request.method == "PUT":
                return jsonify(self.db.update(request.json))

            elif request.method == 'GET':
                return jsonify(self.db.read_all(request.json))
            
            else:
                return jsonify({})


