<img alt="문제어때 리드미" src="https://github.com/user-attachments/assets/4b707a25-68e7-4378-bb94-45ac6fece644" />

> [!NOTE]
> 이 문서는 **엔지니어를 위한 문서**입니다.


## 서비스 기획

문제어때는 문제 제작의 반복적인 작업에서 느낀 불편함에서 출발했습니다.

작은 문제를 빠르게 만들고 풀 수 있는 환경을 만들고자 시작되었으며,

이후 사용자들이 각자의 문제를 공유하고 서로 풀어보는 구조로 발전했습니다.

이 과정에서 문제어때는 개인의 성과 경쟁이 아닌, 함께 성장하며 학습의 저점을 끌어올리는 문화를 목표로 운영되고 있습니다.

### 개발 기간
- 첫 배포 `2024-12-09` ~ `2025-02-09`

### 실행 및 빌드

```bash
# 설치
npm install

# 빌드 
npm run build

# 개발 모드 실행(빌드 파일 생성 후 실행)
npm run start 

```

## 동료

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
## 파일 및 디렉토리 경로 정의

| 변수 | 경로 | 용도 |
| --- | --- | --- |
| `userDataPath` | `app.getPath('userData')` | 로컬 앱 데이터 저장 |
| `questionsCsvPath` | `${userDataPath}/questions.csv` | 문제 데이터 CSV |
| `historyCsvPath` | `${userDataPath}/history.csv` | 문제풀이 이력 |
| `imageDir` | `${userDataPath}/images` | 이미지 파일 저장 |
| `tempDir` | `${app.getPath('temp')}/questions_export` | ZIP 내보내기 임시 디렉토리 |

## IPC Channel

| Channel 이름               | 설명                                         | Renderer → Main 입력              | Main → Renderer 출력                        |
| ------------------------ | ------------------------------------------ | ------------------------------- | ----------------------------------------- |
| `read-questions-csv`     | `questions.csv` 파일을 읽어 문제 목록과 전체 태그 목록을 조회 | 없음                              | `{ success, questions, allTag, message }` |
| `update-recommend-dates` | 오늘 날짜 기준으로 문제의 `recommenddate` 갱신          | 없음                              | `{ success, message }`                    |
| `update-questions-file`  | 렌더러 상태의 문제 목록을 CSV 파일로 저장                  | `questions: Question[]`         | `{ success, message }`                    |
| `read-history-csv`       | `history.csv` 파일 읽기                        | 없음                              | `History[]`                               |
| `update-history`         | 문제 풀이 결과(정답/오답)를 기록에 반영                    | `{ isCorrect: boolean }`        | `{ success, message }`                    |
| `save-image`             | 이미지 파일을 앱 데이터 디렉터리에 저장                     | `{ fileName, content(Buffer) }` | `{ success, path, filename }`             |
| `delete-image`           | 저장된 이미지 파일 삭제                              | `{ imgPath: string }`           | `{ success, message }`                    |
| `export-questions`       | 문제 데이터를 ZIP 파일로 내보내기                       | `questions: Question[]`         | `{ success, path }`                       |
| `extract-zip`            | ZIP 파일 압축 해제 후 문제 데이터 복원                   | `{ fileName, content(Buffer) }` | `{ success, questions }`                  |
| `read-app-path`          | 앱 userData 저장 경로 조회                        | 없음                              | `{ appPath: string }`                     |
| `get-app-version`        | 애플리케이션 버전 조회                               | 없음                              | `string`                                  |
| `get-user-id`            | 사용자 고유 ID 조회                               | 없음                              | `string`                                  |


## CSV 스키마 정의

| 컬럼 | 타입 | 설명 |
| --- | --- | --- |
| `title` | string | 문제 제목 |
| `type` | string | 객관식/주관식 |
| `select1~4` | string | 객관식 선택지 |
| `answer` | string | 정답 |
| `description` | string | 문제 해설 |
| `img` | string | 이미지 파일 경로 |
| `level` | number | 난이도 |
| `date`, `update`, `recommenddate`, `solveddate` | string | 상호작용 날짜 |
| `tag` | string | 태그 목록 |


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
| ⑥ 서비스 이용 | 문제 생성 및 풀이 |

## 데이터 플로우

### 문제 생성 / 수정

| 단계 | 설명 |
| --- | --- |
| ① 입력 | 사용자가 React UI에서 문제를 생성 또는 수정 |
| ② 상태 변경 | Renderer Process에서 `questionsAtom` 상태 업데이트 |
| ③ 감지 | `useEffect`로 상태 변경 감지 |
| ④ 요청 | Renderer → Main IPC 호출 |
| ⑤ 처리 | Main Process에서 CSV 파일 갱신 |
| ⑥ 응답 | 처리 결과를 Renderer로 반환 |
| ⑦ 반영 | React 상태 갱신 후 화면 렌더링 |

### 이미지 업로드

| 단계 | 설명 |
| --- | --- |
| ① 입력 | 사용자가 이미지 파일 선택 |
| ② 요청 | Renderer에서 `saveImage(id, file)` 호출 |
| ③ 변환 | FileReader로 ArrayBuffer 변환 |
| ④ 전달 | Renderer → Main IPC 전송 |
| ⑤ 저장 | Main Process에서 이미지 디렉터리에 저장 |
| ⑥ 응답 | 저장된 이미지 경로 반환 |

### 데이터 조회

| 단계 | 설명 |
| --- | --- |
| ① 시작 | 앱 실행 |
| ② 요청 | Renderer에서 `readQuestionsCSV()` 호출 |
| ③ 처리 | Main Process에서 CSV 파일 읽기 |
| ④ 파싱 | CSV 데이터를 JSON으로 변환 |
| ⑤ 저장 | `questionsAtom` 상태에 저장 |
| ⑥ 렌더링 | 이미지 경로 기준으로 화면 출력 |

### 문제 삭제

| 단계 | 설명 |
| --- | --- |
| ① 선택 | 사용자가 삭제할 문제 선택 |
| ② 상태 변경 | Renderer에서 `questionsAtom`에서 제거 |
| ③ 요청 | Renderer → Main IPC 호출 |
| ④ 처리 | Main Process에서 CSV 파일 갱신 |
| ⑤ 이미지 삭제 | 관련 이미지 파일 삭제 |
| ⑥ 반영 | 변경 내용 화면 반영 |

### CSV · 이미지 동기화

| 단계 | 설명 |
| --- | --- |
| ① 생성/수정 | 문제 저장 시 CSV 갱신 + 이미지 저장 |
| ② 삭제 | 문제 삭제 시 CSV 갱신 + 이미지 삭제 |
| ③ 시작 | 앱 실행 시 CSV 로드 |
| ④ 검증 | 이미지 파일 존재 여부 확인 |
| ⑤ 대체 | 이미지 누락 시 기본 이미지 사용 |

### ZIP 내보내기

| 단계 | 설명 |
| --- | --- |
| ① 요청 | Renderer에서 `exportQuestions` 호출 |
| ② 수집 | CSV 파일과 이미지 파일 수집 |
| ③ 생성 | ZIP 파일 생성 |
| ④ 저장 | 사용자 지정 경로에 저장 |

### ZIP 가져오기

| 단계 | 설명 |
| --- | --- |
| ① 요청 | Renderer에서 ZIP 파일 선택 |
| ② 전달 | Renderer → Main IPC 전송 |
| ③ 해제 | ZIP 압축 해제 |
| ④ 파싱 | CSV 파싱 및 이미지 복사 |
| ⑤ 반영 | Renderer 상태 업데이트 |


## 제안하기
버그 외에도, 사용하시면서 필요하다고 느끼신 기능이나 개선 아이디어가 있다면 

- [![Discussions](https://img.shields.io/github/discussions/HowAboutQuestion/Legacy-HowAboutQuestion?style=flat-square&logo=github)](https://github.com/HowAboutQuestion/Legacy-HowAboutQuestion/discussions) [Discussions](https://github.com/HowAboutQuestion/Legacy-HowAboutQuestion/discussions)에 자유롭게 이야기 해주세요. 
- [![Discord](https://img.shields.io/badge/Discord-Join%20Community-5865F2?logo=discord&style=flat-square)](https://discord.gg/zMjs9HM3SV) [디스코드](https://discord.gg/zMjs9HM3SV)를 통해서도 언제든지 의견을 남기실 수 있니다.
