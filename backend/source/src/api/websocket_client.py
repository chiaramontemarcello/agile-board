import socketio


class WebSocketClient:
    def __init__(self) -> None:
        pass
        self.sio = socketio.Client()
        self.sio.connect('http://backend-agile-websockets:8080')
    
    def emit_event(self,event_name,message):
        self.sio.emit(event_name,message)