import type { Meta, StoryObj } from '@storybook/react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const meta = {
  title: 'ui/table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: `
표(Table) 컴포넌트입니다.

<br />

## Import
\`\`\`tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
\`\`\`

<br />

## Variants

### 1. 기본 테이블
헤더와 데이터를 포함한 기본 테이블입니다.

\`\`\`tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>헤더 1</TableHead>
      <TableHead>헤더 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>데이터 1</TableCell>
      <TableCell>데이터 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>헤더 1</TableHead>
          <TableHead>헤더 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>데이터 1</TableCell>
          <TableCell>데이터 2</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
