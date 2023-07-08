import dayjs from 'dayjs';
import { Open, ChevronForward } from '@styled-icons/ionicons-outline';
import { IconAnchor, IconNextLink } from '@hideo54/reactor';
import Layout from '../components/Layout';

const likes = [
    'プログラミング (主にweb)',
    'アニメ、マンガ',
    '政治、社会',
    '言語',
    '美味しいもの',
    '温泉、サウナ',
    '一人旅',
];

const App = () => (
    <Layout showGoTop={false}>
        <div className='text-center'>
            <img
                src='https://img.hideo54.com/icons/main.png'
                alt='icon'
                width={200}
                height={200}
                className='rounded-full mx-auto my-4'
            />
            <h1 className='text-4xl font-bold my-4'>
                hideo54
            </h1>
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
                <li>
                    <IconAnchor RightIcon={Open} href='https://tmi.t.u-tokyo.ac.jp/'>
                        東京大学大学院工学系研究科技術経営戦略学専攻 (TMI)
                    </IconAnchor>
                </li>
                <li>
                    <IconAnchor RightIcon={Open} href='https://tsg.ne.jp/'>
                        東京大学コンピュータ系サークル TSG
                    </IconAnchor>
                </li>
                {/* <li>
                    <IconAnchor RightIcon={Open} href='https://sunpro.io/'>
                        SunPro (趣味プログラマーサークル)
                    </IconAnchor>
                </li> */}
            </ul>
            <p>私個人へは、上記の所属先は通さずに直接ご連絡ください。</p>
        </section>
        <section>
            <h2>いた</h2>
            <ul>
                <li>
                    <IconAnchor RightIcon={Open} href='https://www.c.u-tokyo.ac.jp/'>
                        東京大学教養学部
                    </IconAnchor>
                    理科1類
                </li>
                <li>
                    <IconAnchor RightIcon={Open} href='https://www.si.t.u-tokyo.ac.jp/course/psi/'>
                        東京大学工学部システム創成学科 (PSI)
                    </IconAnchor>
                </li>
                <li>灘校パソコン研究部 (NPCA)</li>
                <li>
                    セキュリティ・キャンプ (参加: 2016全国、チューター: 2018山梨、2019福岡、2019沖縄)
                </li>
                <li>SECCON Final 2016, 2019</li>
                <li>
                    <IconAnchor
                        RightIcon={Open}
                        href='https://twitter.com/hideo54/status/1204218275233558528'
                    >
                        バーガーキングの壁
                    </IconAnchor>
                </li>
            </ul>
        </section>
        <h2>
            <IconNextLink href='/intro' RightIcon={ChevronForward}>
                もう少し詳しい自己紹介
            </IconNextLink>
        </h2>
        <h2>
            <IconNextLink href='/works' RightIcon={ChevronForward}>
                つくったもの
            </IconNextLink>
        </h2>
        <h2>
            <IconNextLink href='/activity' RightIcon={ChevronForward}>
                活動
            </IconNextLink>
        </h2>
        <h2>
            <IconNextLink href='/visits' RightIcon={ChevronForward}>
                訪問歴
            </IconNextLink>
        </h2>
        <h2>
            <IconNextLink href='/maimai' RightIcon={ChevronForward}>
                maimai でらっくす プレイ状況
            </IconNextLink>
        </h2>
        <section>
            <h2>連絡先</h2>
            <ul>
                <li>Twitter:{' '}
                    <IconAnchor
                        RightIcon={Open}
                        href='https://twitter.com/hideo54'
                    >
                        @hideo54
                    </IconAnchor>
                </li>
                <li>E-mail: <code>contact@hideo54.com</code></li>
            </ul>
        </section>
        <h2>
            <IconNextLink href='/accounts' RightIcon={ChevronForward}>
                アカウント一覧
            </IconNextLink>
        </h2>
        <h2>
            <IconAnchor
                RightIcon={Open}
                href='https://blog.hideo54.com'
            >
                hideo54のブログ
            </IconAnchor>
        </h2>
        <h2>
            <IconAnchor
                RightIcon={Open}
                href='https://www.amazon.co.jp/registry/wishlist/3IQ53EU2L62AI'
            >
                Amazonほしいものリスト
            </IconAnchor>
        </h2>
        <p className='mt-4'>
            <small>
                アイコンのキツネは、Webブラウザ “Firefox” のマスコットキャラクター「フォクすけ」です。
                <IconAnchor
                    RightIcon={Open}
                    href='https://creativecommons.org/licenses/by-nc/4.0/deed.ja'
                >
                    CC BY-NC 4.0 ライセンス
                </IconAnchor>
                で提供された、Mozilla Japan による
                <IconAnchor
                    RightIcon={Open}
                    href='http://foxkeh.jp/downloads/materials/'
                >
                    画像素材
                </IconAnchor>
                を使用しています。
            </small>
        </p>
    </Layout>
);

export default App;
