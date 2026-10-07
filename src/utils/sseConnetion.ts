/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
export function useSSEConnection(memberId: string) {
  const [taskUpdates, setTaskUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (!memberId) {
      console.log('memberId 없음');
      return;
    }

    console.log(`SSE 연결 시도: https://api.popomance.kr/sse/subscribe/${memberId}`);

    const eventSource = new EventSource(`https://api.popomance.kr/sse/subscribe/${memberId}`);

    // readyState 상태 로깅
    console.log('EventSource 초기 상태:', {
      readyState: eventSource.readyState,
      CONNECTING: EventSource.CONNECTING,
      OPEN: EventSource.OPEN,
      CLOSED: EventSource.CLOSED,
    });

    eventSource.onopen = (event) => {
      console.log('SSE 연결 성공 - onopen 이벤트:', event);
    };

    eventSource.onmessage = (event) => {
      console.log('SSE 메시지 수신:', event);
      console.log('Raw 데이터:', event.data);
    };

    eventSource.addEventListener('open', (event) => {
      console.log('SSE open 이벤트 리스너:', event);
    });

    eventSource.addEventListener('message', (event) => {
      try {
        console.log('message 이벤트 리스너:', event);
        const cleanData = event.data.trim();

        console.log('클린 데이터:', cleanData);

        // 연결 확인 메시지 무시
        if (cleanData.startsWith('Connection established')) {
          console.log('연결 확인 메시지:', cleanData);
          return;
        }

        const parsedData = JSON.parse(cleanData);

        // 성공적인 응답인 경우에만 처리
        if (parsedData.success && parsedData.data) {
          console.log('Parsed Task Data:', parsedData.data);

          // 로컬 스토리지에 저장
          const existingTasks = JSON.parse(localStorage.getItem('taskUpdates') || '[]');
          const updatedTasks = [...existingTasks, ...parsedData.data];
          localStorage.setItem('taskUpdates', JSON.stringify(updatedTasks));

          setTaskUpdates((prev) => [...prev, ...parsedData.data]);
        }
      } catch (error) {
        console.error('SSE 데이터 파싱 오류:', error);
        console.error('문제의 데이터:', event.data);
      }
    });

    eventSource.onerror = (error) => {
      console.error('SSE 연결 오류:', error);
      console.error('EventSource 상태:', {
        readyState: eventSource.readyState,
        url: eventSource.url,
      });

      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('연결 종료됨. 재연결 필요.');
      }

      eventSource.close();
    };

    return () => {
      console.log('SSE 연결 정리');
      eventSource.close();
    };
  }, [memberId]);

  return taskUpdates;
}
