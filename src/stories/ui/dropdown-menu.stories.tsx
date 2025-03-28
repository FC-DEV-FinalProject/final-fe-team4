import type { Meta, StoryObj } from '@storybook/react';
import { TbChevronRight } from 'react-icons/tb';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const meta = {
  title: 'ui/dropdown-menu',
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component: `
드롭다운 메뉴 컴포넌트는 클릭 시 표시되는 옵션 목록을 제공합니다.

<br />

## Import
\`\`\`tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  // ... 필요한 컴포넌트들
} from '@/components/ui/dropdown-menu';
\`\`\`

<br />

## 주요 구성 요소
- **DropdownMenu**: 드롭다운의 루트 컴포넌트
- **DropdownMenuTrigger**: 드롭다운을 열기 위한 트리거 버튼
- **DropdownMenuContent**: 드롭다운의 내용을 담는 컨테이너
- **DropdownMenuItem**: 드롭다운 메뉴의 각 항목
- **DropdownMenuSeparator**: 메뉴 항목 사이의 구분선
- **DropdownMenuLabel**: 메뉴 섹션의 레이블
`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">메뉴 열기</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>내 계정</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>프로필</DropdownMenuItem>
        <DropdownMenuItem>설정</DropdownMenuItem>
        <DropdownMenuItem>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithSubMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">서브메뉴 예제</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>옵션</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            더 보기
            <TbChevronRight className="ml-auto" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>서브 메뉴 1</DropdownMenuItem>
            <DropdownMenuItem>서브 메뉴 2</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">체크박스 메뉴</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>설정</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>
          알림 받기
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>이메일 수신</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithRadioItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">라디오 메뉴</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>테마 선택</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="light">
          <DropdownMenuRadioItem value="light">라이트</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">다크</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">시스템</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">그룹 메뉴</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>계정</DropdownMenuLabel>
          <DropdownMenuItem>프로필</DropdownMenuItem>
          <DropdownMenuItem>설정</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>도움말</DropdownMenuLabel>
          <DropdownMenuItem>문서</DropdownMenuItem>
          <DropdownMenuItem>지원</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
