import type { Meta, StoryObj } from '@storybook/react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from '@/components/ui/select';

const meta = {
  title: 'ui/select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: `
Select 컴포넌트는 드롭다운 메뉴를 제공합니다.

<br />

## Import
\`\`\`tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from '@/components/ui/select';
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select
      placeholder="Select an option"
      items={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ]}
    />
  ),
};

export const Grouped: Story = {
  render: () => (
    <Select placeholder="Grouped options">
      <SelectTrigger />
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Group 1</SelectLabel>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Group 2</SelectLabel>
          <SelectItem value="option3">Option 3</SelectItem>
          <SelectItem value="option4">Option 4</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const CustomStyle: Story = {
  render: () => (
    <Select
      placeholder="Custom style"
      items={[
        { value: 'custom1', label: 'Custom Option 1' },
        { value: 'custom2', label: 'Custom Option 2' },
      ]}
      className="bg-gray-100 border-gray-300 text-gray-800"
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select
      placeholder="Disabled select"
      items={[{ value: 'disabled1', label: 'Disabled Option 1' }]}
      disabled
    />
  ),
};
