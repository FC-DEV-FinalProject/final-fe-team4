import 'dayjs/locale/ko';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('ko'); // 한국어 설정

export const formatUpdatedAt = (updatedAt: string): string => {
  if (!updatedAt) {
    return '업데이트 정보 없음';
  }

  const now = dayjs().tz('Asia/Seoul'); // 현재 시간 (한국 표준시)
  const updatedTime = dayjs.utc(updatedAt).tz('Asia/Seoul'); // 업데이트 시간 (UTC -> KST 변환)

  const diffInHours = now.diff(updatedTime, 'hour'); // 시간 차이 계산
  const diffInDays = now.diff(updatedTime, 'day'); // 일 차이 계산

  if (diffInHours < 1) {
    // 1시간 미만: 'n분 전'
    return updatedTime.fromNow();
  } else if (diffInDays < 1) {
    // 하루 미만: 'n시간 전'
    return updatedTime.fromNow();
  } else {
    // 하루 이상: 'MM월 DD일 오후 hh:mm'
    return updatedTime.format(`MM월 DD일 A hh:mm`).replace('AM', '오전').replace('PM', '오후');
  }
};
