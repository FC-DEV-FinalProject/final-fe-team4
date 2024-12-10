import type { Meta, StoryObj } from '@storybook/react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const meta = {
  title: 'ui/tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
탭(Tabs) 컴포넌트는 콘텐츠를 카테고리별로 구분하여 표시하는 데 사용됩니다.

## 사용법
\`\`\`tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
\`\`\`

## 주요 컴포넌트
- Tabs: 최상위 컨테이너
- TabsList: 탭 버튼 그룹
- TabsTrigger: 개별 탭 버튼
- TabsContent: 탭 내용 영역

## 스타일 가이드
- TabsList: \`bg-muted p-1 rounded-md\`
- TabsTrigger: \`px-3 py-1.5 font-medium\`
- TabsContent: \`mt-2\` + 포커스 효과
`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 예제
export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="flex justify-between bg-gray-50 p-1 rounded-md">
        <TabsTrigger value="account" className="flex-1 px-4 py-2">
          계정
        </TabsTrigger>
        <TabsTrigger value="password" className="flex-1 px-4 py-2">
          비밀번호
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4">
        계정 설정
      </TabsContent>
      <TabsContent value="password" className="p-4">
        비밀번호 설정
      </TabsContent>
    </Tabs>
  ),
};

// 추가 예제들...
