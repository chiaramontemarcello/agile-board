FROM python:3.9.7-slim-buster

WORKDIR /app

COPY ./source/requirements.txt .

RUN python -m pip install -r requirements.txt

COPY ./source/src .

EXPOSE 8080

ENTRYPOINT [ "python" ]

CMD [ "waitress_server.py" ]