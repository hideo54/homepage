import Head from 'next/head';
import Header from './Header';

export default ({ children, title = 'Default title', withHeader = true }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
    </Head>
    {withHeader && (
      <header>
        <Header />
      </header>
    )}
    {children}
  </>
);