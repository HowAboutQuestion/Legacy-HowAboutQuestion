## 프로젝트 개요

## 팀 구성

| **권해림** | **최은창** |
| --- | --- |
| [<img src="./gif/gun.jpg" height=150 width=150> <br/> @haerim-kweon](https://github.com/haerim-kweon) |  [<img src="./gif/eun.jpg" height=150 width=150> <br/> @cod0216](https://github.com/cod0216) |

## 기술 스택 요약

| 구분 | 기술 |
| --- | --- |
| **FrontEnd** | React.js, TailwindCSS, Recoil, Chart.js |
| **BackEnd**  | Electron.js |
| **DataBase** | .csv File |
| **Packaging & Distribution** | Electron Builder, Electron Forge, Auto Update (electron-updater) |
| **Version Control** | GitHub |
| **cooperation** | Discord, ZEP, Obsidian |
| **Design** | Figma |

## 아키텍처

<img width="1792" height="942" alt="image" src="https://github.com/user-attachments/assets/94bd8f6d-ff96-4d21-8780-a59f5b56d6e3" />


## ADR

| 항목 | 선택한 기술 / 구조 | 선택 이유 |
| --- | --- | --- |
| **FE 프레임워크** | **React** | SPA 구조로 빠른 화면 전환 가능<br>컴포넌트 기반 구조로 재사용성 및 유지보수성이 높음 |
| **상태 관리** | **Recoil** | 학습 곡선이 낮고 설정이 간단함<br>프로젝트 복잡도가 낮아 간결한 API로 충분함<br>Redux 대비 보일러플레이트가 적음 |
| **App 프레임워크** | **Electron** | 로컬 파일 시스템 접근 필요<br>인터넷 연결 없이 오프라인 실행 가능<br>크로스플랫폼 지원(Windows, macOS, Linux)<br>자동 업데이트 기능으로 배포 효율성 향상 |
| **데이터 저장 형식** | **CSV + Node.js fs** | 개인 학습용 앱으로 DB 불필요<br>CSV는 Excel에서 열기 쉬워 사용자 친화적<br>fs 모듈로 로컬 파일 입출력 구현이 간단함 |
| **서버 구성 여부** | **미구성 (로컬 전용)** | 완전한 오프라인 환경을 목표로 설계<br>ZIP 파일 형태로 문제집 공유 가능 |


## 프로젝트 디렉토리 구조

```
project-root/
├─ assets/                      # 아이콘, 이미지 등 리소스
├─ build/                       # 빌드 시 생성되는 정적 파일
├─ gif/                         # GIF 리소스
├─ out/                         # 배포용 빌드 아웃풋
├─ public/                      # 정적 파일
├─ src/                         # 소스 코드
│  ├─ config/                   # 앱 설정 관련
│  ├─ controllers/              # 데이터/리소스 처리 
│  ├─ handlers/                 # 이벤트(IPC) 수신 및 Controller/Service 호출
│  ├─ hooks/                    # React 커스텀 훅
│  ├─ pages/                    # 화면 단위 컴포넌트
│  │  ├─ dashboard/
│  │  ├─ ...
│  ├─ services/                 # 앱 운영/비즈니스 로직 구현
│  ├─ state/                    # 전역 상태 관리
│  ├─ utils/                    # 공통 유틸리티
├─ main.js                      # Electron 메인 프로세스 진입점
├─ preload.cjs                  # Electron 브리지 스크립트 (Main ↔ Renderer)
├─ Router.js                    # React 라우터 설정
├─ App.js                       # React 앱 최상위 컴포넌트
├─ index.js                     # React 진입점                                   
└─ README.md

```

## 실행 및 빌드

```bash
# 설치
npm install

# 빌드 
npm run build

# 개발 모드 실행(빌드 파일 생성 후 실행)
npm run start 

```

## 애플리케이션 생명주기

```jsx
App Launch
  ↓
Main Process 초기화
  ↓
IPC Handler 등록
  ↓
데이터 전처리 (CSV)
  ↓
BrowserWindow 생성
  ↓
Renderer(React) 로드
  ↓
사용자 인터랙션
  ↓
Window 종료
  ↓
App 종료
```

### 초기 부팅

| 단계 | 설명 |
| --- | --- |
| ① 실행 | `HowAboutQuestion.exe`파일 실행 |
| ② IPC Handler 설정 | `IpcHandler.js`에 정의된 함수를 설정 |
| ③ 데이터 전처리 | `question CSV` 파일에서 오늘 날짜를 기준으로 문제의 추천 날짜 업데이트 |
| ④ 윈도우 생성 | 브라우저 창을 생성하고 `index.html`을 로드하여 애플리케이션 시작 |
| ⑤ 업데이트 | `latest.yml` 과 github을 비교하여 확인 및 업데이트 |

### 문제 생성 / 수정

| 단계 | 설명 |
| --- | --- |
| ① 입력 | 사용자가 React UI에서 문제 등록/삭제 |
| ② 요청 | Renderer → Main (IPC 통신) |
| ③ 처리 | Main에서 fs.writeFileSync / readFileSync 로 CSV 갱신 |
| ④ 응답 | 처리 결과를 Renderer에 전달 |
| ⑤ 렌더링 | React 상태 갱신 → 화면 반영 |

## 데이터 플로우

### 파일 및 디렉토리 경로 정의

| 변수 | 경로 | 용도 |
| --- | --- | --- |
| `userDataPath` | `app.getPath('userData')` | 로컬 앱 데이터 저장 |
| `questionsCsvPath` | `${userDataPath}/questions.csv` | 문제 데이터 CSV |
| `historyCsvPath` | `${userDataPath}/history.csv` | 문제풀이 이력 |
| `imageDir` | `${userDataPath}/images` | 이미지 파일 저장 |
| `tempDir` | `${app.getPath('temp')}/questions_export` | ZIP 내보내기 임시 디렉토리 |

### CSV 스키마 정의

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `title` | string | 문제 제목 |
| `type` | string | 문제 유형 |
| `select1~4` | string | 객관식 선택지 |
| `answer` | string | 정답 |
| `description` | string | 문제 해설 |
| `img` | string | 이미지 파일 경로 |
| `level` | number | 난이도 |
| `date`, `update`, `recommenddate`, `solveddate` | string | 날짜 관련 |
| `tag` | string | 태그 목록 |

### CRUD 처리 플로우

#### Create / Update

1. **문제 생성/수정**
    - Renderer Process에서 `questionsAtom` 상태를 업데이트.
    - `useEffect`로 상태 변화를 감지 → `window.electronAPI.updateQuestions(questions)` 호출.
    - IPC → Main 프로세스 → `fileController.updateQuestionsFile`에서 CSV 파일 갱신.
2. **이미지 업로드**
    - Renderer에서 `window.electronAPI.saveImage(id, file)` 호출.
    - FileReader로 ArrayBuffer 변환 후 Main 프로세스에 전달.
    - `fileController.saveImage`에서 `imageDir`에 저장.
    

#### Read

- 앱 시작 시 `window.electronAPI.readQuestionsCSV()` 호출.
- CSV 파싱 후 `questionsAtom` 상태에 저장.
- `<img src={appPath + question.img}>` 형식으로 렌더링.

#### Delete

- 문제 삭제: `questionsAtom` 상태에서 제거 후 `updateQuestions` 호출.
- 이미지 삭제: `window.electronAPI.deleteImage(imgPath)` 호출.

#### CSV와 이미지 동기화 플로우

1. 문제 생성/수정 → CSV 업데이트 + 이미지 저장
2. 문제 삭제 → CSV 갱신 + 이미지 삭제
3. 앱 시작 시 CSV 로드 → 이미지 파일 존재 여부 확인 → 누락 시 기본 이미지 사용
4. ZIP 내보내기/가져오기
    - `exportQuestions`: CSV + 이미지 ZIP 생성
    - `extractZip`: CSV 파싱 + 이미지 복사 → Renderer 상태 업데이트
