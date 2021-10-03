from flask import request, jsonify
from api.websocket_client import WebSocketClient
from database.database_connection import DatabaseConnection

class Api:
    def __init__(self, app) -> None:
        self.db = DatabaseConnection()
        self.setup_rest_api_endpoints(app)
        self.ws_client = WebSocketClient()

    def setup_rest_api_endpoints(self, app):
        api_endpoint = "/api/v1/"

        @app.route(api_endpoint+'tasks', methods = ['POST', 'GET', 'PUT', 'DELETE'])
        def task_event_handler():
            if request.method == 'POST':
                task = self.db.create(request.json)
                self.ws_client.emit_event('taskUpdated',dict(task))
                return jsonify(task)
            
            elif request.method == "PUT":
                task = self.db.update(request.json)
                self.ws_client.emit_event('taskUpdated',dict(task))
                return jsonify(task)

            elif request.method == "DELETE":
                task = self.db.delete(request.json)
                self.ws_client.emit_event('taskUpdated',{"uuid":request.json['uuid']})
                return jsonify(task)

            elif request.method == 'GET':
                return jsonify(self.db.read_all(request.json))
            
            else:
                return jsonify({})


