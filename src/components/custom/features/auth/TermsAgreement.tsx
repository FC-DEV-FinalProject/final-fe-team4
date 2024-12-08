import { useState } from 'react';
import { Control, ControllerRenderProps } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { SignupFormData } from '@/types/signup';

interface TermsAgreementProps {
  control: Control<SignupFormData>;
  onOpenTerms: (type: 'service' | 'privacy', isAll?: boolean) => void;
}

type TermsField = ControllerRenderProps<SignupFormData, 'terms'>;

const TermsAgreement = ({ control, onOpenTerms }: TermsAgreementProps) => {
  const [isAllTermsFlow, setIsAllTermsFlow] = useState(false);

  const handleAllTermsChange = (checked: boolean, field: TermsField) => {
    if (checked) {
      setIsAllTermsFlow(true);
      field.onChange(['age']);
      onOpenTerms('service', true);
    } else {
      setIsAllTermsFlow(false);
      field.onChange([]);
    }
  };

  const handleTermChange = (checked: boolean, id: string, field: TermsField) => {
    if (checked) {
      if (id === 'age') {
        const currentTerms = field.value || [];
        field.onChange([...currentTerms, id]);
      } else if (id === 'service' || id === 'privacy') {
        onOpenTerms(id, false);
      }
    } else {
      const currentTerms = field.value || [];
      field.onChange(currentTerms.filter((value: string) => value !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FormField
          control={control}
          name="terms"
          render={({ field }) => (
            <>
              <Checkbox
                id="all-term"
                onCheckedChange={(checked) => handleAllTermsChange(checked as boolean, field)}
                checked={field.value?.length === 3}
                className="h-[18px] w-[18px]"
              />
              <label htmlFor="all-term" className="text-sm font-medium">
                모두 동의
              </label>
            </>
          )}
        />
      </div>
      <FormField
        control={control}
        name="terms"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col gap-2">
              {[
                { id: 'age', label: '만 14세 이상' },
                { id: 'service', label: '서비스 이용약관 동의' },
                { id: 'privacy', label: '개인정보 수집 · 이용 동의' },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center gap-2">
                  <FormItem className="flex items-center space-x-2 m-0">
                    <Checkbox
                      checked={field.value?.includes(id)}
                      onCheckedChange={(checked) => handleTermChange(checked as boolean, id, field)}
                      className="h-[18px] w-[18px]"
                    />
                  </FormItem>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium leading-none">
                      <span className="text-primary">(필수)</span> {label}
                    </label>
                    {id !== 'age' && (
                      <button
                        type="button"
                        onClick={() => onOpenTerms(id as 'service' | 'privacy')}
                        className="text-sm text-gray-500 hover:text-gray-700 ml-1"
                      >
                        보기
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {!isAllTermsFlow && <FormMessage />}
          </FormItem>
        )}
      />
    </div>
  );
};

export default TermsAgreement;
