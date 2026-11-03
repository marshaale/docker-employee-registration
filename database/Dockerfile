FROM postgres

ENV POSTGRES_USER=${POSTGRES_USER:-postgres}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}

EXPOSE 5432

VOLUME "/var/lib/postgresql"

CMD ["postgres"]