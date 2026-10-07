import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'ui/dialog',
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component: `
Dialog 컴포넌트는 다양한 다이얼로그 스타일을 제공합니다.

<br />

## Import
\`\`\`tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
\`\`\`

<br />

### 주요 구성 요소
- **Dialog**: 다이얼로그 루트 컴포넌트.
- **DialogTrigger**: 다이얼로그를 열기 위한 트리거.
- **DialogContent**: 다이얼로그의 내용이 포함된 컨테이너.
- **DialogHeader**: 다이얼로그 제목과 설명 영역.
- **DialogFooter**: 다이얼로그 하단의 버튼 배치.
- **DialogTitle**: 다이얼로그 제목.
- **DialogDescription**: 다이얼로그 설명.
- **DialogClose**: 다이얼로그를 닫기 위한 버튼.

---
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button size="sm">다이얼로그 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>기본 다이얼로그</DialogTitle>
          <DialogDescription>이것은 기본 다이얼로그입니다.</DialogDescription>
        </DialogHeader>
        <p>여기에 본문 내용을 입력하세요.</p>
        <DialogFooter>
          <DialogClose>
            <Button size="sm" variant="outline">
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" variant="destructive">
          삭제
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>삭제 확인</DialogTitle>
          <DialogDescription>정말로 삭제하시겠습니까?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button size="sm" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button size="sm" variant="destructive">
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button size="sm">프로필 편집</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로필 편집</DialogTitle>
          <DialogDescription>필요한 정보를 수정하세요.</DialogDescription>
        </DialogHeader>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium">이름</label>
            <Input placeholder="이름 입력" className="w-full" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">이메일</label>
            <Input type="email" placeholder="이메일 입력" className="w-full" />
          </div>
          <DialogFooter>
            <DialogClose>
              <Button size="sm" variant="outline">
                취소
              </Button>
            </DialogClose>
            <Button size="sm" type="submit">
              저장
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  ),
};
