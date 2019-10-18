import Head from 'next/head';
import Header from './Header';

export default ({
  children,
  title = 'hideo',
  description = title,
  withHeader = true
}) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta name='description' content={description} />
    </Head>
    {withHeader && (
      <header>
        <Header />
      </header>
    )}
    {children}
  </>
);