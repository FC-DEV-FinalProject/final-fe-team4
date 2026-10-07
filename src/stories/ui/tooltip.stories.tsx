import type { Meta, StoryObj } from '@storybook/react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const meta = {
  title: 'ui/tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Tooltip 컴포넌트는 추가 정보를 제공하는 작은 팝업으로, 사용자 상호작용에 따라 표시됩니다.

<br />

## Import
\`\`\`tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
\`\`\`

<br />

## 사용 예제

### 기본 Tooltip
기본 Tooltip 사용법입니다.

\`\`\`tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <button>Hover me</button>
    </TooltipTrigger>
    <TooltipContent>Tooltip message</TooltipContent>
  </Tooltip>
</TooltipProvider>
\`\`\`

### 위치 변경
Tooltip의 위치를 변경할 수 있습니다.

\`\`\`tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <button>Hover me</button>
    </TooltipTrigger>
    <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
  </Tooltip>
</TooltipProvider>
\`\`\`

### 커스텀 오프셋
Tooltip의 표시 위치를 세부적으로 조정할 수 있습니다.

\`\`\`tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <button>Hover me</button>
    </TooltipTrigger>
    <TooltipContent side="top" sideOffset={10}>
      Offset tooltip
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
\`\`\`

### 긴 텍스트
Tooltip에 긴 텍스트를 포함할 수 있습니다.

\`\`\`tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>
      <button>Hover me</button>
    </TooltipTrigger>
    <TooltipContent>
      This is a long tooltip message that wraps across multiple lines to provide detailed information.
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button>Hover me</button>
        </TooltipTrigger>
        <TooltipContent>Default Tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Positioned: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button>Bottom Tooltip</button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Tooltip positioned at the bottom</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Offset: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button>Tooltip with Offset</button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={10}>
          Offset tooltip at the top
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const LongText: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button>Hover for long text</button>
        </TooltipTrigger>
        <TooltipContent>
          This is a long tooltip message that spans multiple lines to provide detailed and
          descriptive information.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
