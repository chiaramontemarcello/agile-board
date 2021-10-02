import asyncio
from websockets import connect

print("hello")

async def hello(uri):
    async with connect(uri) as websocket:
        await websocket.send("Hello world!")
        await websocket.recv()

asyncio.run(hello("ws://localhost:8765"))