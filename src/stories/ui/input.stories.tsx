import type { Meta, StoryObj } from '@storybook/react';

import { Input } from '@/components/ui/input';

const meta = {
  title: 'ui/input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
기본적인 입력 필드 컴포넌트입니다.

<br />
<br />

## Import
\`\`\`tsx
import { Input } from '@/components/ui/input';
\`\`\`

<br />

## Variants

<br />

### variant

입력 필드의 스타일을 지정합니다.

- \`default\`
  - 크기와 텍스트
    - \`h-10\`: 40px 높이
    - \`text-base\`: 기본 텍스트 크기
    - \`file:text-foreground\`: 파일 입력시 텍스트 색상
  - 포커스
    - \`focus-visible:ring-1\`: 1px 링 두께
    - \`focus-visible:ring-blue-500\`: 파란색 링

- \`signin\`
  - 크기와 스타일
    - \`h-12\`: 48px 높이
    - \`border-gray-200\`: 회색 테두리
    - \`text-black\`: 검은색 텍스트
    - \`placeholder:text-gray-400\`: 회색 플레이스홀더
  - 포커스
    - \`focus:outline-none\`: 기본 아웃라인 제거
    - \`focus:border-primary\`: 기본 색상 테두리
    - \`focus:ring-primary\`: 기본 색상 링
    - \`focus:ring-1\`: 1px 링 두께

### 공통 스타일

모든 입력 필드에 적용되는 기본 스타일입니다.

- 레이아웃
  - \`flex w-full\`: 전체 너비 플렉스
  - \`rounded-md\`: 둥근 모서리
  - \`border border-input\`: 테두리
  - \`bg-background\`: 배경색
  - \`px-3 py-2\`: 패딩

- 파일 입력 스타일
  - \`file:border-0\`: 테두리 없음
  - \`file:bg-transparent\`: 투명 배경
  - \`file:text-sm\`: 작은 텍스트
  - \`file:font-medium\`: 중간 굵기

- 상태 스타일
  - \`ring-offset-background\`: 링 오프셋 배경
  - \`placeholder:text-muted-foreground\`: 흐린 플레이스홀더
  - \`focus-visible:outline-none\`: 포커스 아웃라인 제거
  - \`disabled:cursor-not-allowed\`: 비활성화시 커서
  - \`disabled:opacity-50\`: 비활성화시 투명도

<br />

## 사용 예시

\`\`\`tsx
// 기본 입력 필드
<Input type="text" placeholder="기본 입력" />

// 로그인용 입력 필드
<Input
  variant="signin"
  type="email"
  placeholder="이메일을 입력하세요"
/>

// 비활성화된 입력 필드
<Input disabled type="text" placeholder="비활성화" />

// 파일 입력
<Input type="file" />

// 필수 입력 필드
<Input
  required
  type="text"
  placeholder="필수 입력"
/>

// 오류 상태 입력 필드
<Input
  className="border-red-500 focus-visible:ring-red-500"
  type="text"
  placeholder="오류 상태"
/>

// 아이콘이 있는 입력 필드
<div className="relative">
  <Input type="search" placeholder="검색..." />
  <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
</div>
\`\`\`
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url', 'file'],
    },
    variant: {
      control: 'select',
      options: ['default', 'signin'],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: '기본 입력',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: '이메일을 입력하세요',
    variant: 'signin',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '비밀번호를 입력하세요',
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: '비활성화된 입력',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    type: 'text',
    placeholder: '필수 입력',
    required: true,
  },
};

export const WithError: Story = {
  render: () => (
    <div className="grid gap-1.5">
      <Input
        type="email"
        placeholder="이메일을 입력하세요"
        className="border-red-500 focus-visible:ring-red-500"
      />
      <p className="text-sm text-red-500">유효한 이메일 주소를 입력하세요.</p>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <label htmlFor="email" className="text-sm font-medium">
        이메일
      </label>
      <Input type="email" id="email" placeholder="이메일을 입력하세요" />
    </div>
  ),
};

export const File: Story = {
  args: {
    type: 'file',
  },
};

export const Search: Story = {
  render: () => (
    <div className="max-w-sm">
      <div className="relative">
        <Input type="search" placeholder="검색어를 입력하세요" />
        <svg
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  ),
};

export const FormGroup: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          이름
        </label>
        <Input id="name" placeholder="이름을 입력하세요" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          이메일
        </label>
        <Input type="email" id="email" placeholder="이메일을 입력하세요" />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          비밀번호
        </label>
        <Input type="password" id="password" placeholder="비밀번호를 입력하세요" />
      </div>
    </div>
  ),
};
