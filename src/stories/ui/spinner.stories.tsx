import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from '@/components/ui/spinner';

const meta = {
  title: 'ui/spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: `
로딩 상태를 나타내는 스피너(Spinner) 컴포넌트입니다.

<br />

## Import
\`\`\`tsx
import { Spinner } from '@/components/ui/spinner';
\`\`\`

<br />

## Variants

### 1. 기본 스피너
기본 크기의 스피너입니다.

\`\`\`tsx
<Spinner />
\`\`\`

### 2. 커스텀 크기 스피너
크기를 조정할 수 있는 스피너입니다.

\`\`\`tsx
<Spinner size={30} />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Spinner />,
};

export const CustomSize: Story = {
  render: () => <Spinner size={30} />,
};
