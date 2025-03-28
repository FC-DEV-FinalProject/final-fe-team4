import FindAccount from '@/components/custom/forms/FindAccountForm';

interface AccountRecoveryPageProps {
  type: 'ID' | 'PW';
}

const AccountRecoveryPage: React.FC<AccountRecoveryPageProps> = ({ type }) => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <FindAccount type={type} />
    </div>
  );
};

export default AccountRecoveryPage;
