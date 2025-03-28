import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from '@/components/ui/switch';

const meta = {
  title: 'ui/switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
스위치(Switch) 컴포넌트입니다.

<br />

## Import
\`\`\`tsx
import { Switch } from '@/components/ui/switch';
\`\`\`

<br />

## Variants

### 1. 기본 스위치
기본 On/Off 스위치입니다.

\`\`\`tsx
<Switch />
\`\`\`

### 2. 비활성화 상태
비활성화된 상태의 스위치입니다.

\`\`\`tsx
<Switch disabled />
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Switch />,
};

export const Disabled: Story = {
  render: () => <Switch disabled />,
};
