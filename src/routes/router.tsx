import { createBrowserRouter } from 'react-router-dom';

import Layout from '@/layouts/Layout';
import AccountRecoveryPage from '@/pages/AccountRecoveryPage';
import ConcatPage from '@/pages/ConcatPage';
import ErrorPage from '@/pages/ErrorPage';
import HistoryPage from '@/pages/HistoryPage';
import HomePage from '@/pages/HomePage';
import MyPage from '@/pages/MyPage';
import ProjectPage from '@/pages/ProjectPage';
import SigninPage from '@/pages/SigninPage';
import SignupPage from '@/pages/SignupPage';
import TTSPage from '@/pages/TTSPage';
import VCPage from '@/pages/VCPage';
import ProtectedRoute from '@/routes/ProtectedRoute';

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
      // 404 에러 페이지
      {
        path: '*',
        element: <ErrorPage />,
      },
      // 로그인 후에만 접근 가능한 페이지들
      {
        element: <ProtectedRoute />,
        children: [
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
            path: `${PATH.TTS}/:id`,
            element: <TTSPage />,
          },
          {
            path: PATH.CONCAT,
            element: <ConcatPage />,
          },
          {
            path: `${PATH.CONCAT}/:id`,
            element: <ConcatPage />,
          },
          {
            path: PATH.VC,
            element: <VCPage />,
          },
          {
            path: `${PATH.VC}/:id`,
            element: <VCPage />,
          },
          {
            path: PATH.MYPAGE,
            element: <MyPage />,
          },
        ],
      },
    ],
  },
]);

export { PATH, router };
