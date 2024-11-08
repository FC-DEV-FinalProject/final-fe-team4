import { Button } from '@/components/ui/CommonButton';
import Tooltip from '@/components/ui/Tooltip';

const ExamplePage = () => {
  return (
    <div>
      {/* 버튼 컨포넌트 */}
      <div>
        {/* default */}
        <Button>Button</Button>
        <Button disabled>Button</Button>
        {/* mid + icon */}
        <Button size="mid" icon>
          Button
        </Button>
        <Button size="mid" icon disabled>
          Button
        </Button>
        {/* icon */}
        <Button size="icon" />
        <Button size="icon" disabled />
        {/* Secondary - Grey */}
        <Button variant="secondary">Button</Button>
        <Button variant="secondary" disabled>
          Button
        </Button>
      </div>

      {/* 툴팁 컨포넌트 */}
      <div>
        <Tooltip text="변경된 설정을 적용하려면 재생성 버튼을 눌러주세요!" />
      </div>
    </div>
  );
};

export default ExamplePage;
