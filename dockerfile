FROM cirrusci/flutter:stable

COPY . /app

WORKDIR /app

RUN flutter pub get

RUN flutter build web

EXPOSE 8080

CMD ["flutter", "run", "--release"]
