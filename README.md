# Todo Backend (Node.js)

간단한 Express 기반의 할일 API 입니다. 현재는 메모리 저장소를 사용하며, 추후 DB 연동으로 교체할 수 있습니다.

## 엔드포인트
- GET `/api/todos` 목록 조회
- POST `/api/todos` 생성 `{ text: string }`
- PATCH `/api/todos/:id` 수정 `{ text?: string, done?: boolean }`
- DELETE `/api/todos/:id` 삭제

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
서버: http://localhost:8787

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

## package.json
패키지 : 프로그램 만드는데 있어서 nodejs를 쉽게 쓸 수 있는 툴(라이브러리) 정보를 package.json에 담고 있다. 

## gitignore
github에 올릴 때 굳이 올릴 필요 없는 것, 보안 파일 정리해놓은 것. 