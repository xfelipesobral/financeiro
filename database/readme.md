O `docker-compose` é uma ferramenta poderosa para definir e gerenciar aplicações multi-contêiner. Além dos comandos básicos, como `up` e `down`, existem muitos outros comandos úteis que podem ajudar na administração de seus serviços. Aqui estão alguns dos comandos mais importantes e suas descrições:

### Comandos Básicos

- **`docker-compose up`**: Cria e inicia os contêineres definidos no arquivo `docker-compose.yml`.
  ```sh
  docker-compose up
  ```

- **`docker-compose down`**: Para e remove os contêineres, redes e volumes criados pelo `docker-compose up`.
  ```sh
  docker-compose down
  ```

### Comandos Úteis

- **`docker-compose ps`**: Lista os contêineres em execução.
  ```sh
  docker-compose ps
  ```

- **`docker-compose logs`**: Exibe os logs de saída dos serviços.
  ```sh
  docker-compose logs
  ```

- **`docker-compose start`**: Inicia os contêineres parados definidos no `docker-compose.yml`.
  ```sh
  docker-compose start
  ```

- **`docker-compose stop`**: Para os contêineres em execução sem removê-los.
  ```sh
  docker-compose stop
  ```

- **`docker-compose restart`**: Reinicia os contêineres.
  ```sh
  docker-compose restart
  ```

- **`docker-compose build`**: Constrói ou reconstrói os serviços.
  ```sh
  docker-compose build
  ```

- **`docker-compose pull`**: Faz o download das imagens dos serviços.
  ```sh
  docker-compose pull
  ```

- **`docker-compose config`**: Valida e exibe a configuração do Compose.
  ```sh
  docker-compose config
  ```

- **`docker-compose rm`**: Remove os contêineres parados.
  ```sh
  docker-compose rm
  ```

### Opções Adicionais

- **`-d`**: Executa os contêineres em segundo plano.
  ```sh
  docker-compose up -d
  ```

- **`--build`**: Força a reconstrução das imagens antes de iniciar os contêineres.
  ```sh
  docker-compose up --build
  ```

- **`--force-recreate`**: Força a recriação dos contêineres mesmo que não tenha havido mudanças na definição.
  ```sh
  docker-compose up --force-recreate
  ```

- **`--remove-orphans`**: Remove contêineres órfãos (contêineres que não estão definidos no arquivo `docker-compose.yml` atual).
  ```sh
  docker-compose up --remove-orphans
  ```