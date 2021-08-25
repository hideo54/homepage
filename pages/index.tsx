/* eslint-disable @next/next/no-img-element */
import dayjs from 'dayjs';
import Layout from '../components/Layout';
import { OpenIconLink, GoNextIconLink } from '../components/atoms';

const likes = [
    'プログラミング (主にweb)',
    'アニメ、マンガ',
    '政治・法',
    '言語',
    '美味しいもの',
    '温泉、サウナ',
    '一人旅',
];

const App = () => (
    <Layout>
        <div style={{ textAlign: 'center' }}>
            <img src='https://img.hideo54.com/icons/main.png' alt='icon' width={200} height={200} style={{ borderRadius: 100, margin: '1em' }} />
            <h1>hideo54</h1>
            <p>1999年8月2日生まれ、{dayjs().diff('1999-08-02', 'years')}歳。</p>
            <p>コンピュータを使って遊ぶのが好き。</p>
        </div>
        <section>
            <h2>好きなもの</h2>
            <ul>
                {likes.map(like => <li key={like}>{like}</li>)}
            </ul>
        </section>
        <section>
            <h2>現在の所属</h2>
            <ul>
                <li>東京大学工学部システム創成学科 (PSI)</li>
                <li>
                    <OpenIconLink href='https://tsg.ne.jp/'>
                        東京大学コンピュータ系サークル TSG
                    </OpenIconLink>
                </li>
                <li>
                    <OpenIconLink href='https://sunpro.io/'>
                        SunPro (趣味プログラマーサークル)
                    </OpenIconLink>
                </li>
            </ul>
            <p>私個人へは、上記の所属先は通さずに直接ご連絡ください。</p>
        </section>
        <section>
            <h2>いた</h2>
            <ul>
                <li>東京大学教養学部理科1類</li>
                <li>灘校パソコン研究部 (NPCA)</li>
                <li>セキュリティ・キャンプ (参加: 2016全国、チューター: 2018山梨、2019福岡、2019沖縄)</li>
                <li>SECCON Final 2016, 2019</li>
                <li>
                    <OpenIconLink href='https://twitter.com/hideo54/status/1204218275233558528'>
                        バーガーキングの壁
                    </OpenIconLink>
                </li>
            </ul>
        </section>
        <h2>
            <GoNextIconLink href='/intro'>もう少し詳しい自己紹介</GoNextIconLink>
        </h2>
        <h2>
            <GoNextIconLink href='/works'>つくったもの</GoNextIconLink>
        </h2>
        <h2>
            <GoNextIconLink href='/activity'>活動</GoNextIconLink>
        </h2>
        <section>
            <h2>連絡先</h2>
            <ul>
                <li>Twitter: <OpenIconLink href='https://twitter.com/hideo54'>@hideo54</OpenIconLink></li>
                <li>E-mail: <code>contact@hideo54.com</code></li>
            </ul>
        </section>
        <h2>
            <GoNextIconLink href='/accounts'>アカウント一覧</GoNextIconLink>
        </h2>
        {/* <h2>
            <GoNextIconLink href='/pay'>hideo54 Pay</GoNextIconLink>
        </h2> */}
        <h2>
            <OpenIconLink href='https://blog.hideo54.com'>hideo54のブログ</OpenIconLink>
        </h2>
        <h2>
            <OpenIconLink href='https://www.amazon.co.jp/registry/wishlist/3IQ53EU2L62AI'>Amazonほしいものリスト</OpenIconLink>
        </h2>
        <p style={{ marginTop: '2em' }}>
            <small>
                アイコンのキツネは、Webブラウザ “Firefox” のマスコットキャラクター「フォクすけ」です。
                <OpenIconLink href='https://creativecommons.org/licenses/by-nc/4.0/deed.ja'>
                    CC BY-NC 4.0 ライセンス
                </OpenIconLink>
                で提供された、Mozilla Japan による
                <OpenIconLink href='http://foxkeh.jp/downloads/materials/'>
                    画像素材
                </OpenIconLink>
                を使用しています。
            </small>
        </p>
    </Layout>
);

export default App;
