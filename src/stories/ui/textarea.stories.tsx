import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from '@/components/ui/textarea';

const meta = {
  title: 'ui/textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: `
Textarea 컴포넌트는 여러 줄의 텍스트를 입력할 수 있는 필드를 제공합니다.

<br />

## Import
\`\`\`tsx
import { Textarea } from '@/components/ui/textarea';
\`\`\`

<br />

## 사용 예제

### 1. 기본 사용
\`\`\`tsx
<Textarea placeholder="텍스트를 입력하세요." />
\`\`\`

### 2. 초기값 설정
\`\`\`tsx
<Textarea defaultValue="초기 텍스트" />
\`\`\`

### 3. 비활성화 상태
\`\`\`tsx
<Textarea disabled placeholder="입력 비활성화" />
\`\`\`

### 4. 읽기 전용 상태
\`\`\`tsx
<Textarea readOnly value="읽기 전용 텍스트" />
\`\`\`

### 5. 커스텀 높이 및 스타일
\`\`\`tsx
<Textarea className="h-40 border-blue-500" placeholder="높이가 커진 텍스트 영역" />
\`\`\`

---
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Textarea placeholder="텍스트를 입력하세요." />,
};

export const WithDefaultValue: Story = {
  render: () => <Textarea defaultValue="초기 텍스트" />,
};

export const Disabled: Story = {
  render: () => <Textarea disabled placeholder="입력 비활성화" />,
};

export const ReadOnly: Story = {
  render: () => <Textarea readOnly value="읽기 전용 텍스트" />,
};

export const CustomStyle: Story = {
  render: () => <Textarea className="h-40 border-blue-500" placeholder="높이가 커진 텍스트 영역" />,
};
