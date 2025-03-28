import type { Meta, StoryObj } from '@storybook/react';

import { ScrollArea } from '@/components/ui/scroll-area';

const meta = {
  title: 'ui/scroll-area',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
스크롤 영역 컴포넌트입니다.

<br />
<br />

## Import
\`\`\`tsx
import { ScrollArea } from '@/components/ui/scroll-area';
\`\`\`

<br />

## 컴포넌트

### ScrollArea (Root)

- 기본 스타일
 - \`relative\`: 상대적 위치 지정

### Viewport

- 기본 스타일
 - \`h-full\`: 전체 높이 사용
 - \`w-full\`: 전체 너비 사용
 - \`rounded-[inherit]\`: 부모의 border-radius 상속
 - \`overflow-visible\`: 내용이 넘칠 때 보이게 설정

### ScrollBar

- 공통 스타일
 - \`flex\`: 플렉스 컨테이너
 - \`touch-none\`: 터치 이벤트 비활성화
 - \`select-none\`: 텍스트 선택 비활성화
 - \`transition-colors\`: 색상 전환 효과

- 세로 스크롤바
 - \`h-full\`: 전체 높이
 - \`w-1\`: 1px 너비
 - \`border-l border-l-transparent\`: 투명한 왼쪽 테두리
 - \`p-[1px]\`: 1px 패딩

- 가로 스크롤바
 - \`h-2.5\`: 2.5px 높이
 - \`flex-col\`: 세로 방향 플렉스
 - \`border-t border-t-transparent\`: 투명한 위쪽 테두리
 - \`p-[1px]\`: 1px 패딩

- Thumb (스크롤바 핸들)
 - \`relative\`: 상대적 위치
 - \`flex-1\`: 남은 공간 채움
 - \`rounded-full\`: 완전한 원형
 - \`bg-border\`: 테두리 색상 배경

<br />

## 사용 예시

\`\`\`tsx
// 기본 스크롤 영역
<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
 <div>내용</div>
</ScrollArea>

// 가로 스크롤이 있는 영역
<ScrollArea className="w-[350px] whitespace-nowrap rounded-md border">
 <div className="flex w-max space-x-4 p-4">
   <div>아이템 1</div>
   <div>아이템 2</div>
   <div>아이템 3</div>
 </div>
</ScrollArea>
\`\`\`
`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <div>
        <h4 className="mb-4 text-sm font-medium leading-none">세로 스크롤 예시</h4>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="text-sm mt-4">
            {`항목 ${i + 1}`}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-[350px] rounded-md border">
      <div className="flex gap-4 p-4" style={{ width: 'max-content' }}>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="flex-shrink-0">
            <div className="w-[100px] h-[100px] rounded-md bg-slate-100" />
            <div className="mt-2 text-sm text-center">{`항목 ${i + 1}`}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Both: Story = {
  render: () => (
    <ScrollArea className="h-[400px] w-[400px] rounded-md border">
      <div className="p-4" style={{ width: 'max-content' }}>
        <h4 className="mb-4 text-sm font-medium leading-none">가로/세로 스크롤 예시</h4>
        <div className="flex gap-4">
          {Array.from({ length: 20 }, (_, col) => (
            <div key={col} className="flex-shrink-0">
              {Array.from({ length: 20 }, (_, row) => (
                <div
                  key={row}
                  className="w-[150px] h-[50px] mb-4 rounded-md bg-slate-100 flex items-center justify-center"
                >
                  {`항목 ${col + 1}-${row + 1}`}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
};
