import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'ui/badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Badge 컴포넌트는 상태나 카테고리를 표시하는데 사용되는 작은 레이블입니다.

<br />

## Import
\`\`\`tsx
import { Badge } from '@/components/ui/badge';
\`\`\`

<br />

## Variants

### 1. Default
기본 보라색 배경의 뱃지입니다.

\`\`\`tsx
<Badge>기본</Badge>
\`\`\`

### 2. VC (Voice Conversion)
음성 변환 관련 핑크색 뱃지입니다.

\`\`\`tsx
<Badge variant="vc">VC</Badge>
\`\`\`

### 3. TTS (Text-to-Speech)
텍스트 음성 변환 관련 초록색 뱃지입니다.

\`\`\`tsx
<Badge variant="tts">TTS</Badge>
\`\`\`

### 4. Concat
음성 합성 관련 노란색 뱃지입니다.

\`\`\`tsx
<Badge variant="concat">CONCAT</Badge>
\`\`\`
`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Badge>기본</Badge>,
};

export const VoiceConversion: Story = {
  render: () => <Badge variant="vc">VC</Badge>,
};

export const TextToSpeech: Story = {
  render: () => <Badge variant="tts">TTS</Badge>,
};

export const Concatenation: Story = {
  render: () => <Badge variant="concat">CONCAT</Badge>,
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>기본</Badge>
      <Badge variant="vc">VC</Badge>
      <Badge variant="tts">TTS</Badge>
      <Badge variant="concat">CONCAT</Badge>
    </div>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge className="text-sm">큰 텍스트</Badge>
      <Badge className="px-4 py-1">넓은 패딩</Badge>
      <Badge className="shadow-sm">그림자 효과</Badge>
    </div>
  ),
};
