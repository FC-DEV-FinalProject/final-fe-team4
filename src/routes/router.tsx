import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/layouts/Layout';
import AccountRecoveryPage from '@/pages/AccountRecoveryPage';
import CONCATPage from '@/pages/CONCATPage';
import ErrorPage from '@/pages/ErrorPage';
import HistoryPage from '@/pages/HistoryPage';
import HomePage from '@/pages/HomePage';
import MyPage from '@/pages/MyPage';
import ProjectPage from '@/pages/ProjectPage';
import SigninPage from '@/pages/SigninPage';
import SignupPage from '@/pages/SignupPage';
import TTSPage from '@/pages/TTSPage';
import VCPage from '@/pages/VCPage';

const PATH = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  PROJECT: '/project',
  HISTORY: '/history',
  ACCOUNT_RECOVERY_ID: '/find-id',
  ACCOUNT_RECOVERY_PW: '/find-pw',
  TTS: '/tts',
  VC: '/vc',
  CONCAT: '/concat',
  ERROR: '/error',
  MYPAGE: '/mypage',
} as const;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    // 모든 라우트에 대한 에러 처리
    errorElement: <ErrorPage />,
    children: [
      {
        path: PATH.SIGNIN,
        element: <SigninPage />,
      },
      {
        path: PATH.SIGNUP,
        element: <SignupPage />,
      },
      {
        path: PATH.ACCOUNT_RECOVERY_ID,
        element: <AccountRecoveryPage type="ID" />,
      },
      {
        path: PATH.ACCOUNT_RECOVERY_PW,
        element: <AccountRecoveryPage type="PW" />,
      },
      // 특정 에러 페이지 경로
      {
        path: PATH.ERROR,
        element: <ErrorPage />,
      },
      // 그 외 모든 페이지들
      {
        path: PATH.HOME,
        element: <HomePage />,
      },
      {
        path: PATH.PROJECT,
        element: <ProjectPage />,
      },
      {
        path: PATH.HISTORY,
        element: <HistoryPage />,
      },
      {
        path: PATH.TTS,
        element: <TTSPage />,
      },
      {
        path: PATH.CONCAT,
        element: <CONCATPage />,
      },
      {
        path: PATH.VC,
        element: <VCPage />,
      },
      {
        path: PATH.MYPAGE,
        element: <MyPage />,
      },
      // 404 에러 페이지
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);

export { PATH, router };
