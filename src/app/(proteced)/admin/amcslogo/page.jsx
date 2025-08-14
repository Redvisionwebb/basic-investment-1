import AmcsLogo from '@/components/admin/AmcsLogo/index';
import DefaultLayout from '@/components/admin/Layouts/DefaultLaout';

const AmcsPage = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-7xl">
        <AmcsLogo />
      </div>
    </DefaultLayout>
  );
};

export default AmcsPage;
