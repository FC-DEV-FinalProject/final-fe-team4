import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '@/components/ui/checkbox';

const meta = {
  title: 'ui/checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
기본적인 체크박스 컴포넌트입니다.

<br />
<br />

## Import
\`\`\`tsx
import { Checkbox } from '@/components/ui/checkbox';
\`\`\`

<br />

## Variants

<br />

### 기본 스타일

- Root (체크박스 컨테이너)
  - \`peer\`: 피어 선택자 지원
  - \`h-5 w-5\`: 20px x 20px 크기
  - \`shrink-0\`: 축소 방지
  - \`rounded\`: 둥근 모서리
  - \`border\`: 테두리
  - \`border-gray-300\`: 회색 테두리

### 상태별 스타일

- 체크된 상태
  - \`data-[state=checked]:bg-gray-600\`: 진한 회색 배경
  - \`data-[state=checked]:border-gray-600\`: 진한 회색 테두리

- 비활성화 상태
  - \`disabled:cursor-not-allowed\`: 커서 변경
  - \`disabled:opacity-50\`: 50% 투명도

### Indicator (체크 표시)

- 컨테이너 스타일
  - \`flex\`: 플렉스 컨테이너
  - \`items-center\`: 수직 중앙 정렬
  - \`justify-center\`: 수평 중앙 정렬
  - \`text-current\`: 현재 텍스트 색상 사용

- 체크 아이콘
  - \`h-4 w-4\`: 16px x 16px 크기
  - \`text-white\`: 흰색

<br />

## 사용 예시

\`\`\`tsx
// 기본 체크박스
<Checkbox id="term" />

// 라벨과 함께 사용
<div className="flex items-center space-x-2">
  <Checkbox id="term" />
  <label htmlFor="term">이용약관에 동의합니다</label>
</div>

// 기본 체크된 상태
<Checkbox id="checked" defaultChecked />

// 비활성화 상태
<Checkbox id="disabled" disabled />

// 체크된 비활성화 상태
<Checkbox id="checked-disabled" defaultChecked disabled />
\`\`\`
`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="term" />
      <label htmlFor="term" className="text-sm font-medium leading-none">
        이용약관에 동의합니다
      </label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <label htmlFor="checked" className="text-sm font-medium leading-none">
        체크된 상태
      </label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled />
      <label htmlFor="disabled" className="text-sm font-medium leading-none text-muted-foreground">
        비활성화 상태
      </label>
    </div>
  ),
};

export const CheckedDisabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked-disabled" defaultChecked disabled />
      <label
        htmlFor="checked-disabled"
        className="text-sm font-medium leading-none text-muted-foreground"
      >
        체크된 비활성화 상태
      </label>
    </div>
  ),
};

export const WithForm: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="term1" />
        <label htmlFor="term1" className="text-sm font-medium leading-none">
          이용약관에 동의합니다 (필수)
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="term2" />
        <label htmlFor="term2" className="text-sm font-medium leading-none">
          개인정보 수집 및 이용에 동의합니다 (필수)
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="term3" />
        <label htmlFor="term3" className="text-sm font-medium leading-none">
          마케팅 정보 수신에 동의합니다 (선택)
        </label>
      </div>
    </div>
  ),
};
