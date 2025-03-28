import type { Meta, StoryObj } from '@storybook/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const meta = {
  title: 'ui/avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
기본적인 아바타 컴포넌트입니다.

<br />
<br />

## Import
\`\`\`tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
\`\`\`

<br />

## 사용법

### 1. 기본 사용
가장 기본적인 형태의 아바타입니다. 이미지와 대체 텍스트를 함께 사용합니다.

\`\`\`tsx
<Avatar>
 <AvatarImage 
   src="/user-avatar.jpg" 
   alt="사용자 이름" 
 />
 <AvatarFallback>홍길동</AvatarFallback>
</Avatar>
\`\`\`

### 2. 이미지만 사용
이미지만 사용하는 경우입니다. 하지만 접근성을 위해 alt 텍스트는 반드시 포함해야 합니다.

\`\`\`tsx
<Avatar>
 <AvatarImage 
   src="/user-avatar.jpg" 
   alt="사용자 이름" 
 />
</Avatar>
\`\`\`

### 3. Fallback만 사용
이미지 없이 대체 텍스트나 이니셜만 표시하는 경우입니다.

\`\`\`tsx
<Avatar>
 <AvatarFallback>홍길동</AvatarFallback>
</Avatar>

// 이니셜 사용
<Avatar>
 <AvatarFallback>홍</AvatarFallback>
</Avatar>
\`\`\`

### 4. 크기 조정
className을 사용하여 아바타의 크기를 조정할 수 있습니다.

\`\`\`tsx
// 작은 크기
<Avatar className="h-8 w-8">
 <AvatarImage src="/user-avatar.jpg" alt="사용자 이름" />
 <AvatarFallback>홍</AvatarFallback>
</Avatar>

// 기본 크기 (40px)
<Avatar>
 <AvatarImage src="/user-avatar.jpg" alt="사용자 이름" />
 <AvatarFallback>홍</AvatarFallback>
</Avatar>

// 큰 크기
<Avatar className="h-16 w-16">
 <AvatarImage src="/user-avatar.jpg" alt="사용자 이름" />
 <AvatarFallback>홍</AvatarFallback>
</Avatar>
\`\`\`

### 5. 이미지 로드 실패 처리
이미지 로드에 실패한 경우 자동으로 Fallback이 표시됩니다.

\`\`\`tsx
<Avatar>
 <AvatarImage 
   src="잘못된-경로.jpg" 
   alt="사용자 이름" 
 />
 <AvatarFallback>홍</AvatarFallback>
</Avatar>
\`\`\`

### 6. 스타일 커스터마이징
배경색, 텍스트 색상 등을 className으로 커스터마이징할 수 있습니다.

\`\`\`tsx
// Fallback 배경색 변경
<Avatar>
 <AvatarFallback className="bg-blue-500 text-white">
   홍
 </AvatarFallback>
</Avatar>

// 테두리 추가
<Avatar className="ring-2 ring-blue-500 ring-offset-2">
 <AvatarImage src="/user-avatar.jpg" alt="사용자 이름" />
 <AvatarFallback>홍</AvatarFallback>
</Avatar>
\`\`\`

## 컴포넌트 구조

### Root (Avatar)
아바타의 기본 컨테이너입니다.
- \`relative\`: 상대적 위치
- \`flex\`: 플렉스 컨테이너
- \`h-10 w-10\`: 40px x 40px 기본 크기
- \`shrink-0\`: 축소 방지
- \`overflow-hidden\`: 내용물 넘침 숨김
- \`rounded-full\`: 완전한 원형

### Image (AvatarImage)
아바타 이미지를 표시합니다.
- \`aspect-square\`: 1:1 비율
- \`h-full w-full\`: 부모 크기에 맞춤

### Fallback (AvatarFallback)
이미지 로드 실패시 표시되는 대체 콘텐츠입니다.
- \`flex\`: 플렉스 컨테이너
- \`h-full w-full\`: 부모 크기에 맞춤
- \`items-center\`: 수직 중앙 정렬
- \`justify-center\`: 수평 중앙 정렬
- \`rounded-full\`: 완전한 원형
- \`bg-muted\`: 배경색 설정

## 주의사항

1. 접근성을 위해 AvatarImage에는 반드시 alt 속성을 지정해야 합니다.
2. Fallback은 선택사항이지만, 이미지 로드 실패에 대비하여 사용하는 것이 좋습니다.
3. 크기 조정 시 width와 height는 동일한 값을 사용하여 정사각형 비율을 유지해야 합니다.
`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const CustomSize: Story = {
  render: () => (
    <Avatar className="h-12 w-12">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const WithBrokenImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="broken-link.jpg" alt="Broken Image" />
      <AvatarFallback>BK</AvatarFallback>
    </Avatar>
  ),
};

export const Styled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar className="ring-2 ring-blue-500 ring-offset-2">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">홍</AvatarFallback>
      </Avatar>
    </div>
  ),
};
