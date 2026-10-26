import SiteLayout from '@hideo54/ui/components/SiteLayout';
import type { ComponentProps } from 'react';

const Layout = (
    props: Omit<ComponentProps<typeof SiteLayout>, 'siteName' | 'description'> &
        Partial<Pick<ComponentProps<typeof SiteLayout>, 'description'>>,
) => (
    <SiteLayout
        description='hideo54のホームページ'
        siteName='hideo54.com'
        {...props}
    />
);

export default Layout;
