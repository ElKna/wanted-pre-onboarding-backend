# 원티드 프리온보딩 백엔드 인턴십 과제

### 사용 기술 스택
JavaScript(node.js, express), Bash, Docker


### 애플리케이션 실행 방법
실행을 위해선 node 모듈이 설치되어 있어야 합니다.  
해당 Repo를 clone 한 후, 적절한 데이터베이스를 설계 및 실행한 상태에서 아래 코드를 실행하면 애플리케이션이 실행됩니다.
```bash
cd ./wanted-pre-onboarding-backend/wanted-backend-server/

touch .env
#----------------------------------
# HOST_NAME   = <your_db_host_name>
# USER_NAME   = <your_db_user_name>
# PASSWORD    = <your_db_password>
# DATABASE    = <your_db_name>
# JWT_SECRET  = <your_jwt_secret>
#----------------------------------

npm install # Install module package

npm start # Start index.js server by PM2 Module
```

### 데이터베이스 구조

### API 명세
- Sub 1. 사용자 회원가입 엔드포인트
    - Method: POST
    - Endpoint: /users
    - Request
    ```JSON
    {
        "email": "test@mail.com",
        "password": "12345678"
    }
    ```
    - Response
    ```JSON
    // status code 201 Created
    {
        Account Create Complete
    }
    ```
![1](https://github.com/ElKna/wanted-pre-onboarding-backend/assets/87401709/6552794a-7dfe-45d6-bcff-156bb56fcbc4)

- Sub 2. 사용자 로그인 엔드포인트
    - Method: POST
    - Endpoint: /login
    - Request
    ```JSON
    {
        "email": "test@mail.com",
        "password": "12345678"
    }
    ```
    - Response
    ```JSON
    // status code 201 Created
    --JWT TOKEN--
    ```
![2](https://github.com/ElKna/wanted-pre-onboarding-backend/assets/87401709/713bf372-e786-4bd0-823c-9bd3fa517034)

- Sub 3. 새로운 게시글을 생성하는 엔드포인트
    - Method: POST
    - Endpoint: /
    - Request
    ```JSON
    {
        "Authorization": {
            "Bearer": "<your token>"
        },
        "Body" :{
            "title": "test title",
            "contents": "test contents"
        }
    }
    ```
    - Response
    ```JSON
    // status code 201 Created
    {
        "board_id": "1",
        "title": "test title",
        "contents": "test contents",
        "user": "test@mail.com"
    }
    ```
![3](https://github.com/ElKna/wanted-pre-onboarding-backend/assets/87401709/698f848a-4de5-41a1-af84-774055e9e552)

- Sub 4. 게시글 목록을 조회하는 엔드포인트
    - Method: GET
    - Endpoint: /
    - Request: None
    - Response
    ```JSON
    // status code 200 OK
    [
        {
            "board_id": "1",
            "title": "test title",
            "contents": "test contents",
            "user": "test@mail.com"
        },
        {
            "board_id": "2",
            "title": "test title",
            "contents": "test contents",
            "user": "test@mail.com"
        }
    ]
    ```
![4](https://github.com/ElKna/wanted-pre-onboarding-backend/assets/87401709/e1cc63d5-002b-4b58-bb71-8e8795665bfe)

- Sub 5. 특정 게시글을 조회하는 엔드포인트
    - Method: GET
    - Endpoint: /{board_id}
    - Request: None
    - Response
    ```JSON
    // status code 200 OK
    {
        "board_id": "1",
        "title": "test title",
        "contents": "test contents",
        "user": "test@mail.com"
    }
    ```
![5](https://github.com/ElKna/wanted-pre-onboarding-backend/assets/87401709/86181b8b-da04-4ddc-9dc8-5dce803461a2)

- Sub 6. 특정 게시글을 수정하는 엔드포인트
    - Method: POST
    - Endpoint: /{board_id}
    - Request
    ```JSON
    {
        "Authorization": {
            "Bearer": "<your token>"
        },
        "Body" :{
            "title": "test title",
            "contents": "test contents"
        }
    }
    ```
    - Response
    ```JSON
    // status code 201 Created
    {
        "board_id": "1",
        "title": "test title",
        "contents": "test contents",
        "user": "test@mail.com"
    }
    ```
![6](https://github.com/ElKna/wanted-pre-onboarding-backend/assets/87401709/433d4c01-be19-4d49-95e4-fe71f570b8f4)

- Sub 7. 특정 게시글을 삭제하는 엔드포인트
    - Method: DELETE
    - Endpoint: /{board_id}
    - Request: None
    - Response
    ```JSON
    // status code 200 OK
    {
        board_id Delete complete
    }
    ```
  ![7](https://github.com/ElKna/wanted-pre-onboarding-backend/assets/87401709/01738ce1-de8e-4071-8327-b9251303d456)

## Docker compose
Docker 실행을 위해선 docker가 설치되어 있어야 합니다.  
해당 Reop를 클론한 후 아래 코드를 실행하면 초기 데이터베이스 및 애플리케이션이 실행됩니다.
```bash
cd ./wanted-pre-onboarding-backend/

touch .env
#----------------------------------
# USER_NAME   = <your_db_user_name>
# PASSWORD    = <your_db_password>
# DATABASE    = <your_db_name>
#----------------------------------

cd ./wanted-pre-onboarding-backend/wanted-backend-server/

touch .env
#----------------------------------
# HOST_NAME   = <your_db_host_name>
# USER_NAME   = <your_db_user_name>
# PASSWORD    = <your_db_password>
# DATABASE    = <your_db_name>
# JWT_SECRET  = <your_jwt_secret>
#----------------------------------

docker build . -t wanted-backend

cd ../

docker compose up
```
API 호출 방법은 위 API 명세와 동일합니다.

### API 작성자 : 윤영태
