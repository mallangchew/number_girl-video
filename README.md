# Love Cult Archive

정적 호스팅에 바로 올릴 수 있는 웹사이트 버전입니다. 첫 화면은 가로형 인트로이고, `enter`를 누르면 세로형 아카이브 화면으로 들어갑니다.

## 파일 구조

- `index.html`: 공개 첫 화면
- `portrait.html`: 진입 후 표시되는 세로형 화면
- `styles.css`: 프레임, 타이포그래피, 오버레이 스타일
- `script.js`: 숫자 캔버스 애니메이션과 포인터 반응
- `mask-data.js`: 이미지 마스크 포인트 데이터
- `assets/angel-archive-closeup.jpg`: 공유 미리보기와 no-JS fallback용 비주얼 애셋
- `DESIGN.md`: 유지보수용 디자인 시스템

## 로컬에서 확인

브라우저로 `index.html`을 직접 열어도 됩니다. 로컬 서버로 확인하려면 사이트 폴더에서 아래 명령을 실행합니다.

```bash
python3 -m http.server 5173
```

그 다음 `http://localhost:5173`으로 접속합니다.

## 배포

이 폴더는 빌드 과정이 없는 정적 사이트입니다.

- GitHub Pages: 저장소에 이 폴더 내용을 올리고 Pages의 publish root를 저장소 루트로 둡니다.
- Netlify: 이 폴더를 새 사이트로 배포하고 build command는 비워둡니다.
- Vercel: Static project로 import하고 build command 없이 배포합니다.

공개 URL이 생기면 다른 사람들은 그 주소로 바로 접속할 수 있습니다.
