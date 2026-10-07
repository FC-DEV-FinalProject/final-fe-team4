import type { Meta, StoryObj } from '@storybook/react';

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

const meta = {
  title: 'ui/toast',
  component: Toast,
  parameters: {
    docs: {
      description: {
        component: `
Toast 컴포넌트는 사용자 알림 메시지를 표시하는 데 사용됩니다.

<br />

## Import
\`\`\`tsx
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
\`\`\`

<br />

## 주요 구성 요소

- **ToastProvider**: Toast의 컨텍스트를 제공하는 루트 컴포넌트입니다.
- **ToastViewport**: Toast가 렌더링되는 위치를 정의합니다.
- **Toast**: Toast 메시지의 루트 컴포넌트입니다.
- **ToastTitle**: Toast 메시지의 제목입니다.
- **ToastDescription**: Toast의 부가 설명입니다.
- **ToastAction**: Toast에서 액션을 정의하는 버튼입니다.
- **ToastClose**: Toast를 닫는 버튼입니다.

<br />

## 사용 예제

### 기본 Toast
\`\`\`tsx
<ToastProvider>
  <Toast>
    <ToastTitle>기본 알림</ToastTitle>
    <ToastDescription>이것은 기본 알림 메시지입니다.</ToastDescription>
    <ToastClose />
  </Toast>
  <ToastViewport />
</ToastProvider>
\`\`\`

### 파괴적 Toast
\`\`\`tsx
<Toast variant="destructive">
  <ToastTitle>경고</ToastTitle>
  <ToastDescription>위험한 작업입니다.</ToastDescription>
  <ToastClose />
</Toast>
\`\`\`

### 액션 버튼 포함
\`\`\`tsx
<Toast>
  <ToastTitle>업데이트 가능</ToastTitle>
  <ToastDescription>새 버전을 사용할 수 있습니다.</ToastDescription>
  <ToastAction asChild>
    <button>업데이트</button>
  </ToastAction>
  <ToastClose />
</Toast>
\`\`\`

### 다중 Toast
\`\`\`tsx
<ToastProvider>
  <Toast>
    <ToastTitle>첫 번째 알림</ToastTitle>
    <ToastDescription>첫 번째 메시지입니다.</ToastDescription>
    <ToastClose />
  </Toast>
  <Toast>
    <ToastTitle>두 번째 알림</ToastTitle>
    <ToastDescription>두 번째 메시지입니다.</ToastDescription>
    <ToastClose />
  </Toast>
  <ToastViewport />
</ToastProvider>
\`\`\`
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <ToastViewport />
      </ToastProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toast>
      <ToastTitle>기본 알림</ToastTitle>
      <ToastDescription>이것은 기본 알림 메시지입니다.</ToastDescription>
      <ToastClose />
    </Toast>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Toast variant="destructive">
      <ToastTitle>경고</ToastTitle>
      <ToastDescription>위험한 작업입니다.</ToastDescription>
      <ToastClose />
    </Toast>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Toast>
      <ToastTitle>업데이트 가능</ToastTitle>
      <ToastDescription>새 버전을 사용할 수 있습니다.</ToastDescription>
      <ToastAction asChild altText={''}>
        <button className="text-blue-600">업데이트</button>
      </ToastAction>
      <ToastClose />
    </Toast>
  ),
};

export const Multiple: Story = {
  render: () => (
    <>
      <Toast>
        <ToastTitle>첫 번째 알림</ToastTitle>
        <ToastDescription>첫 번째 메시지입니다.</ToastDescription>
        <ToastClose />
      </Toast>
      <Toast>
        <ToastTitle>두 번째 알림</ToastTitle>
        <ToastDescription>두 번째 메시지입니다.</ToastDescription>
        <ToastClose />
      </Toast>
    </>
  ),
};
