import Layout from '../components/Layout';
import { Section, LargetTitle, Paragraph, List, Link } from '../components/Basic';

const Home = () => (
  <Layout title='hideo54.com' description='hideo54のホームページ' withHeader={false}>
    <Section center={true}>
      <LargetTitle>hideo54</LargetTitle>
      <p>
        1999年8月2日生まれ、20歳。
        <br/>
        <span>コンピュータを使って</span>
        <wbr/>
        <span>遊ぶのが</span>
        <wbr/>
        <span>好きです。</span>
      </p>
    </Section>
    <Section title='好きなこと'>
      <List>
        <li>プログラミング (Web, iOS, IoT, etc.)</li>
        <li>アニメ観賞 (ゆるふわ日常系、その他気まぐれ)</li>
        <li>言語</li>
        <li>好きなものを食べること (ただし好き嫌いが激しい)</li>
        <li>温泉、サウナ (ただしのぼせやすい)</li>
        <li>一人旅</li>
      </List>
    </Section>
    <Section title='現在の所属'>
      <List>
        <li>東京大学教養学部前期課程(理科1類)</li>
        <li>
          <Link href='https://tsg.ne.jp/'>東京大学コンピュータ系サークル TSG</Link>
        </li>
        <li>
          <Link href='https://sunpro.io/'>SunPro</Link> (趣味プログラマサークル)
        </li>
        <li>
          <Link href='https://ctftime.org/team/34478'>elfjp</Link> (幽霊CTFチーム)
        </li>
        <li>
          <Link href='https://harekaze.com/'>Harekaze</Link> (CTFチーム) (幽霊メンバー)
        </li>
      </List>
      <Paragraph>僕個人へは、上記の所属先は通さず、以下の連絡先に直接ご連絡ください。</Paragraph>
    </Section>
    <Section title='いた'>
      <List>
        <li>灘高校</li>
        <li>セキュリティ・キャンプ(参加: 2016全国、チューター: 2018山梨、2019福岡)</li>
        <li>SECCON 2016 決勝大会</li>
      </List>
    </Section>
    <Section href='/intro' title='もう少し詳しい自己紹介' />
    <Section href='/activity' title='活動' />
    <Section title='連絡先'>
      <List>
        <li>Twitter: <Link href='https://twitter.com/hideo54'>@hideo54</Link></li>
        <li>Eメール: contact@hideo54.com</li>
      </List>
    </Section>
    <Section href='/accounts' title='アカウント一覧' />
    <Section href='/pay' title='hideo54 Pay' />
    <Section href='https://blog.hideo54.com' title='ブログ' />
    <Section href='https://www.amazon.co.jp/registry/wishlist/3IQ53EU2L62AI' title='Amazon ほしいものリスト' />
  </Layout>
);

export default Home;