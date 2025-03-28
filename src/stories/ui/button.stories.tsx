import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';

const meta = {
  title: 'ui/button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
기본적인 버튼 컴포넌트입니다.

<br />
<br />

## Import
\`\`\`tsx
import { Button } from '@/components/ui/button';
\`\`\`

<br />

## 사용법

### 1. 기본 버튼
기본 스타일(파란색 배경)의 버튼입니다.

\`\`\`tsx
// 기본 크기 (360px)
<Button>기본 버튼</Button>

// 비활성화 상태
<Button disabled>비활성화</Button>
\`\`\`

### 2. 스타일 변형 (variant)

#### default
- 파란색 배경의 기본 버튼
- hover시 밝은 파란색, active시 진한 파란색
\`\`\`tsx
<Button variant="default">기본 버튼</Button>
\`\`\`

#### destructive
- 위험/삭제 작업을 나타내는 빨간색 버튼
- hover시 90% 불투명도
\`\`\`tsx
<Button variant="destructive">삭제</Button>
\`\`\`

#### outline
- 테두리만 있는 버튼
- hover시 배경색과 텍스트 색상 변경
\`\`\`tsx
<Button variant="outline">테두리 버튼</Button>
\`\`\`

#### secondary
- 회색 테두리의 보조 버튼
- hover시 연한 회색 배경과 검은색 텍스트
- active시 진한 회색 배경
\`\`\`tsx
<Button variant="secondary">보조 버튼</Button>
\`\`\`

#### ghost
- 배경색이 없는 투명 버튼
- hover시에만 배경색 표시
\`\`\`tsx
<Button variant="ghost">고스트 버튼</Button>
\`\`\`

#### link
- 링크처럼 보이는 버튼
- hover시 밑줄 표시
\`\`\`tsx
<Button variant="link">링크 버튼</Button>
\`\`\`

### 3. 크기 변형 (size)

#### default
- 너비: 360px, 높이: 56px
- 글자: 18px, 굵게
\`\`\`tsx
<Button size="default">기본 크기</Button>
\`\`\`

#### sm (small)
- 높이: 36px
- 좌우 패딩: 12px
\`\`\`tsx
<Button size="sm">작은 버튼</Button>
\`\`\`

#### md (middle)
- 너비: 196px
- 패딩: 좌우 19px, 상하 12px
- 글자: 16px, 굵게
\`\`\`tsx
<Button size="md">중간 버튼</Button>
\`\`\`

#### lg (large)
- 높이: 44px
- 좌우 패딩: 32px
\`\`\`tsx
<Button size="lg">큰 버튼</Button>
\`\`\`

#### icon
- 기본: 56x56px 정사각형
- navbar 확장 시: 너비 196px로 변경
\`\`\`tsx
<Button size="icon" icon />

// navbar에서 사용 시
<div className="group/navbar">
 <Button size="icon" icon>메뉴</Button>
</div>
\`\`\`

### 4. 아이콘 버튼 (icon)
+ 아이콘을 포함한 버튼을 만들 수 있습니다.

\`\`\`tsx
// 텍스트와 함께 사용
<Button icon>새로 만들기</Button>

// 아이콘만 사용
<Button size="icon" icon />

// navbar에서 확장되는 아이콘 버튼
<div className="group/navbar">
 <Button size="icon" icon>메뉴</Button>
</div>
\`\`\`

### 5. HTML 요소 변경 (asChild)
버튼을 다른 HTML 요소로 변경할 수 있습니다.

\`\`\`tsx
// 링크로 변경
<Button asChild>
 <a href="/path">링크로 이동</a>
</Button>

// div로 변경
<Button asChild>
 <div role="button">클릭 가능한 div</div>
</Button>
\`\`\`

### 6. 조합 사용 예시

#### 작은 보조 버튼
\`\`\`tsx
<Button variant="secondary" size="sm">
 작은 보조 버튼
</Button>
\`\`\`

#### 아이콘이 있는 중간 크기 버튼
\`\`\`tsx
<Button variant="default" size="md" icon>
 새로 만들기
</Button>
\`\`\`

#### 비활성화된 아웃라인 버튼
\`\`\`tsx
<Button variant="outline" disabled>
 비활성화된 테두리 버튼
</Button>
\`\`\`

### 7. 접근성 고려사항

1. 비활성화된 버튼에는 항상 시각적 표시(opacity)가 있습니다.
2. 포커스 상태가 명확하게 표시됩니다 (ring 스타일).
3. 적절한 커서 스타일이 적용됩니다.
4. 키보드 탐색이 지원됩니다.

### 8. 성능 고려사항

1. 버튼 크기가 고정되어 있어 레이아웃 시프트가 발생하지 않습니다.
2. 트랜지션은 colors 속성에만 적용되어 있습니다.
3. 아이콘 버튼의 경우 조건부 렌더링을 최소화했습니다.
`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'md', 'lg', 'icon'],
    },
    icon: {
      control: 'boolean',
    },
    asChild: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: '기본 버튼',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: '보조 버튼',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: '삭제',
    variant: 'destructive',
  },
};

export const Ghost: Story = {
  args: {
    children: '고스트',
    variant: 'ghost',
  },
};

export const WithIcon: Story = {
  args: {
    children: '새로 만들기',
    icon: true,
    size: 'md',
  },
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    icon: true,
  },
};

export const Small: Story = {
  args: {
    children: '작은 버튼',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: '큰 버튼',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: '비활성화 버튼',
    disabled: true,
  },
};

export const AsLink: Story = {
  args: {
    children: 'a',
    asChild: true,
  },
  render: (args) => (
    <Button {...args}>
      <a href="/">링크 버튼</a>
    </Button>
  ),
};
