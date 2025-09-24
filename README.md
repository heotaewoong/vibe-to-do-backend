# Todo Backend (Node.js)

간단한 Express + MongoDB 기반의 할일 API 입니다. `.env`로 DB 연결을 설정합니다.

## 엔드포인트
- GET `/api/todos` 목록 조회 (별칭: `/todos`)
- POST `/api/todos` 생성 `{ text: string }`
- PATCH `/api/todos/:id` 수정 `{ text?: string, done?: boolean }`
- DELETE `/api/todos/:id` 삭제
- GET `/health` 서버/DB 상태
- GET `/debug/db` DB 디버그 정보
- GET `/todoapp` 간단한 정적 확인 페이지 (Heroku 404 방지용)

## 실행 방법 (Windows / PowerShell)
```powershell
cd "c:/Users/ihtwa/OneDrive/바탕 화면/noonaProject/vibecoding/todoapp/todo-backend"
npm install
# 환경변수 설정
cp .env.example .env
# 필요시 .env의 ORIGIN 값을 프론트 주소로 변경 (예: http://localhost:5173)

# 개발 모드 (자동 재시작)
npm run dev
# 또는 프로덕션 모드
npm start
```
기본 포트: `PORT` 환경변수(미설정시 5000)
서버 예시: http://localhost:5000

## 프론트엔드 연동 예시
CORS가 허용된 도메인에서 아래처럼 호출할 수 있습니다.
```js
fetch('http://localhost:8787/api/todos', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ text: '새 할일' })
}).then(r=>r.json()).then(console.log)
```

## 다음 단계
- 파일 또는 DB 저장소로 교체 (SQLite, Firebase, Supabase 등)
- 인증 추가 후 사용자별 데이터 분리
- 테스트/배포 스크립트 추가
 
## Heroku 404 해결 가이드
- 증상: `https://<app>.herokuapp.com/todoapp` 404 Not Found
- 원인: 서버에 해당 경로가 없거나 정적 파일 서빙 미구성
- 조치:
  1. 이 프로젝트는 `/todoapp` 경로를 정적 폴더 `public/todoapp`으로 매핑함. 배포 후 페이지가 떠야 정상.
  2. Heroku 로그 확인
     ```powershell
     heroku logs --tail --app <your-heroku-app>
     ```
  3. API는 `/api/todos` (별칭 `/todos`)로 제공. 프론트 요청 경로를 재확인.
  4. DB 연결 이슈로 서버 부팅 실패하는지 확인. 필요시 임시로 `SKIP_DB=1`로 부팅해 정적 라우트/헬스체크만 확인 가능.
 
## 환경변수 (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
# 개발 중 DB 없이 정적 라우팅만 확인하고 싶을 때
# SKIP_DB=1
```

## package.json
패키지 : 프로그램 만드는데 있어서 nodejs를 쉽게 쓸 수 있는 툴(라이브러리) 정보를 package.json에 담고 있다. 

## gitignore
github에 올릴 때 굳이 올릴 필요 없는 것, 보안 파일 정리해놓은 것. 