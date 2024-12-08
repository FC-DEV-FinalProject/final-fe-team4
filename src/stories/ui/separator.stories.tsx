import type { Meta, StoryObj } from '@storybook/react';

import { Separator } from '@/components/ui/separator';

const meta = {
  title: 'ui/separator',
  component: Separator,
  parameters: {
    docs: {
      description: {
        component: `
Separator 컴포넌트는 콘텐츠 간의 시각적 구분을 제공합니다.

<br />

## Import
\`\`\`tsx
import { Separator } from '@/components/ui/separator';
\`\`\`

<br />

## 주요 속성

- **orientation**: Separator의 방향을 설정합니다. \`horizontal\`(기본값) 또는 \`vertical\`을 선택할 수 있습니다.
- **decorative**: 접근성을 위해 Separator가 단순히 장식적일 경우 \`true\`(기본값)로 설정합니다.
- **className**: 추가적인 스타일을 지정할 수 있습니다.

<br />

## 사용 예제

### 기본 Separator
\`\`\`tsx
<Separator />
\`\`\`

### 수직 Separator
\`\`\`tsx
<Separator orientation="vertical" />
\`\`\`

### 커스텀 스타일 Separator
\`\`\`tsx
<Separator className="h-2 bg-red-500" />
\`\`\`

---
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="space-y-4">
      <div>위의 콘텐츠</div>
      <Separator />
      <div>아래의 콘텐츠</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-16 items-center space-x-4">
      <div>왼쪽 콘텐츠</div>
      <Separator orientation="vertical" />
      <div>오른쪽 콘텐츠</div>
    </div>
  ),
};

export const CustomStyle: Story = {
  render: () => (
    <div className="space-y-4">
      <div>위의 콘텐츠</div>
      <Separator className="h-2 bg-red-500" />
      <div>아래의 콘텐츠</div>
    </div>
  ),
};
