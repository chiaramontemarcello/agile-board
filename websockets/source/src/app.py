from aiohttp import web
import socketio

sio = socketio.AsyncServer(cors_allowed_origins="*")
app2 = web.Application()
sio.attach(app2)

def setup_socket_endpoints(sio):
    @sio.on('message')
    async def print_message(sid, message):
        print("Socket ID: " , message)

    @sio.on('positionUpdate') # echoes position changes
    async def broadcast_position_change(sid, message):
        await sio.emit('positionUpdate', message)
    
    @sio.on('taskUpdated') 
    async def broadcast_position_change(sid, message):
        await sio.emit('taskUpdated', message)

    @sio.on('updateView') 
    async def broadcast_position_change(sid, message):
        await sio.emit('updateView', message)

setup_socket_endpoints(sio)

print("running")

## We kick off our server
if __name__ == '__main__':
    web.run_app(app2)