export const GOOGLE_TTS_CONFIG = {
  SPEED: {
    DEFAULT: 1.0,
    MIN: 0.25,
    MAX: 4.0,
    STEP: 0.1,
    DESCRIPTION: '음성 재생 속도. 1.0은 정상 속도, 0.5는 절반 속도, 2.0은 두 배 속도',
  },
  PITCH: {
    DEFAULT: 0.0,
    MIN: -20.0,
    MAX: 20.0,
    STEP: 0.1,
    DESCRIPTION: '음성 톤 높낮이 조정. 세미톤 단위로, 양수는 높게, 음수는 낮게 설정',
  },
  VOLUME: {
    DEFAULT: 0.0,
    MIN: -96.0,
    MAX: 16.0,
    STEP: 1.0,
    DESCRIPTION: '음성 볼륨 조정. 데시벨(dB) 단위로, 양수는 볼륨 증가, 음수는 감소',
  },
} as const;
