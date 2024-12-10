# popomance.studio 오디오 변환 플랫폼
 TTS/VC/CONCAT 오디오 서비스 구현을 위한 리포지토리

[배포 주소 링크](https://popomance.kr/)
[스토리북 배포 링크](https://673559d8ad04dea21f3f8013-pjizwnrelv.chromatic.com/)

## 목차
- [popomance.studio 오디오 변환 플랫폼](#popomancestudio-오디오-변환-플랫폼)
  - [목차](#목차)
  - [제작 기간 \& 참여 인원](#제작-기간--참여-인원)
  - [폴더 구조도](#폴더-구조도)
  - [설치 및 실행 방법](#설치-및-실행-방법)
  - [사용한 기술](#사용한-기술)
    - [프론트엔드](#프론트엔드)
    - [CI/CD](#cicd)
  - [핵심 기능](#핵심-기능)
    - [TTS 기능](#tts-기능)
    - [VC 기능](#vc-기능)
    - [CONCAT 기능](#concat-기능)
    - [프로젝트 관리 기능](#프로젝트-관리-기능)
  - [아키텍처](#아키텍처)
  - [시스템 아키텍처](#시스템-아키텍처)
  - [특징](#특징)

## 제작 기간 & 참여 인원
- 제작 기간: 2024년 11월 01일 ~ 2024년 12월 06일

- 참여 인원
| Name | GitHub |
|------|--------|
| 김도형 | @dhkim511 |
| 김승민 | @miniseung |
| 임효정 | @dyeongg |
| 송진 | @sjgaru-dev |
| 고낙연 | @nakyenoko3 |


## 폴더 구조도

## 설치 및 실행 방법
1. 저장소를 클론합니다

```bash
git clone https://github.com/your-repo/popomance.studio.git
cd popomance.studio
```

2. 필요한 패키지를 설치합니다
```bash
npm install
```

3. 개발 서버를 실행합니다
```bash
npm run dev
```


## 사용한 기술
### 프론트엔드
- React ^18.3.1
- TypeScript 5.3.2
- Tailwind CSS ^3.4.14
- shadcn/ui (Radix UI 기반: ^1.1.0 ~ ^2.1.2)
- Storybook ^8.4.4
- zustand ^5.0.1
- axios ^1.7.7


### CI/CD
- GitHub Actions
- AWS Amplify
- Firebase Hosting
- EC2
- Nginx

## 핵심 기능

### TTS 기능
- 사용자가 입력한 텍스트를 음성으로 변환
- 여러 줄의 텍스트를 한 번에 텍스트 파일을 통해 입력 가능
- 이전에 변환된 음성 파일에 대한 히스토리 기능

![](https://i.imgur.com/kH4XRBQ.gif)


### VC 기능
- 사용자가 업로드한 음성 파일을 다른 화자의 음성 스타일로 변환
- 사용자가 원하는 화자의 음성 스타일을 선택 가능

![](https://i.imgur.com/fVuUZ7z.gif)

### CONCAT 기능
- 음성 파일을 합치고, 무음을 추가하여 음성 파일을 생성
- 여러 음성 파일에 한 번에 구간별 무음 추가 기능

![](https://i.imgur.com/LSF0Yar.gif)

### 프로젝트 관리 기능
- 삭제 및 조회
- 필터링
- 검색

## 아키텍처

## 시스템 아키텍처

## 특징
- CI/CD 파이프라인 구축
- Storybook을 통한 컴포넌트 개발
- shadcn/ui 라이브러리 도입
- 각종 자동화 스크립트 구축


