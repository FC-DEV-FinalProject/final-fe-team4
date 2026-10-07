import type { Meta, StoryObj } from '@storybook/react';

import { Slider } from '@/components/ui/slider';

const meta = {
  title: 'ui/slider',
  component: Slider,
  parameters: {
    docs: {
      description: {
        component: `
슬라이더(Slider) 컴포넌트입니다.

<br />

## Import
\`\`\`tsx
import { Slider } from '@/components/ui/slider';
\`\`\`

<br />

## Variants

### 1. 기본 슬라이더
기본 범위(0~100)의 슬라이더입니다.

\`\`\`tsx
<Slider defaultValue={[50]} max={100} />
\`\`\`

### 2. 고정 간격 슬라이더
고정된 간격으로 이동하는 슬라이더입니다.

\`\`\`tsx
<Slider defaultValue={[20]} max={100} step={10} />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Slider defaultValue={[50]} max={100} />,
};

export const Stepped: Story = {
  render: () => <Slider defaultValue={[20]} max={100} step={10} />,
};
