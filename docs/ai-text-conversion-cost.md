# AI言葉変換のコスト分析

## あなたの要望

```yaml
❌ バッサリ消す（NG）:
  「クソ難しかった」 → 「難しかった」
  → 「クソ」が消えて不自然

✅ 自然に変換（OK）:
  「クソ難しかった」 → 「とても難しかった」
  → 意味が保たれて自然
```

## AI使った変換の実現方法

### OpenAI API（GPT-4o-mini）

#### プロンプト例

```javascript
const prompt = `
以下の文章を優しく自然な言葉に変換してください。
ただし、意味やニュアンスは保ってください。

ルール:
- 強い言葉や攻撃的な表現を柔らかくする
- 文章の長さは変えない（±10文字以内）
- 意味を失わない
- 自然な日本語にする

入力: "${userText}"
出力: 変換後の文章のみ
`;

// 例
入力: "クソ難しかったけど頑張った"
出力: "とても難しかったけど頑張った"

入力: "マジでつらかったわ"
出力: "本当に大変だった"

入力: "全然できなくて最悪"
出力: "なかなか上手くいかなくて大変だった"
```

#### コスト計算

```yaml
GPT-4o-mini 料金（2025年1月現在）:
  入力: $0.150 / 1M tokens
  出力: $0.600 / 1M tokens

1投稿あたりのtoken数:
  プロンプト（固定）: 約100 tokens
  ユーザー入力（平均）: 約50 tokens（200文字）
  出力: 約50 tokens
  合計: 約200 tokens

1投稿あたりのコスト:
  入力（150 tokens）: $0.000023
  出力（50 tokens）: $0.000030
  合計: $0.000053 ≈ $0.00005

つまり: 1投稿0.005円（0.5銭）
```

#### Phase別コスト

```yaml
Phase 1（100ユーザー、10投稿/日）:
  10投稿/日 × 30日 = 300投稿/月
  300 × $0.00005 = $0.015/月
  ≈ $0/月（無視できる金額）

Phase 2（1,000ユーザー、100投稿/日）:
  100投稿/日 × 30日 = 3,000投稿/月
  3,000 × $0.00005 = $0.15/月
  ≈ $0/月（ほぼ無料）

Phase 3（10,000ユーザー、1,000投稿/日）:
  1,000投稿/日 × 30日 = 30,000投稿/月
  30,000 × $0.00005 = $1.50/月
  ≈ $2/月（激安）

Phase 4（100,000ユーザー、10,000投稿/日）:
  10,000投稿/日 × 30日 = 300,000投稿/月
  300,000 × $0.00005 = $15/月
  ≈ $15/月（まだ安い）

結論: AI変換は超安い ✅
```

## 実装方法

### パターンA: リアルタイム変換（推奨）

```javascript
// フロントエンド（投稿時）
async function convertText(text) {
  // Firebase Functions経由でOpenAI APIを呼ぶ
  const response = await fetch('https://your-project.cloudfunctions.net/convertText', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });

  const { convertedText } = await response.json();
  return convertedText;
}

// ユーザーが投稿ボタンを押す
const originalText = "クソ難しかったけど頑張った";

// AI変換（1-2秒）
const convertedText = await convertText(originalText);
// → "とても難しかったけど頑張った"

// 通知表示
showNotification({
  title: "優しい言葉に変換されました✨",
  before: originalText,
  after: convertedText,
  actions: ["投稿する", "修正する"]
});
```

```javascript
// Firebase Functions
const functions = require('firebase-functions');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.convertText = functions.https.onCall(async (data, context) => {
  const { text } = data;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "以下の文章を優しく自然な言葉に変換してください。強い言葉や攻撃的な表現を柔らかくしますが、意味やニュアンスは保ってください。変換後の文章のみを出力してください。"
      },
      {
        role: "user",
        content: text
      }
    ],
    temperature: 0.3, // 安定した変換
    max_tokens: 100
  });

  const convertedText = completion.choices[0].message.content.trim();

  return { convertedText };
});
```

### パターンB: 必要な時だけ変換（コスト最適化）

```javascript
// 強い言葉を検出してからAI変換
function needsConversion(text) {
  const harshWords = ['クソ', 'マジで', '死ぬほど', 'バカ', '最悪', 'うざい'];
  return harshWords.some(word => text.includes(word));
}

// 投稿時
if (needsConversion(text)) {
  // AI変換する
  const convertedText = await convertText(text);
  showNotification(...);
} else {
  // そのまま投稿
  postDirectly(text);
}

// コスト削減効果:
// 変換必要な投稿: 30%と仮定
// Phase 3コスト: $1.50 × 0.3 = $0.45/月
```

## 正規表現 vs AI の比較

### 正規表現版（現在の想定）

```javascript
const softWords = {
  'クソ': '',
  'マジで': 'とても',
  '死ぬほど': 'とても',
  // ...
};

// 変換例
"クソ難しかった"
→ "難しかった" ❌ 不自然

"マジでつらかったわ"
→ "とてもつらかったわ" ⚠️ まあまあ

"全然できなくて最悪"
→ "全然できなくて大変" ⚠️ 少し不自然
```

```yaml
メリット:
  ✅ 無料
  ✅ 即座に変換（レイテンシなし）
  ✅ オフライン可能

デメリット:
  ❌ 不自然な変換
  ❌ 文脈を理解できない
  ❌ パターン追加が大変
  ❌ 複雑な文章に対応できない
```

### AI版（GPT-4o-mini）

```javascript
// 変換例
"クソ難しかったけど頑張った"
→ "とても難しかったけど頑張った" ✅ 自然

"マジでつらかったわ"
→ "本当に大変だった" ✅ 自然

"全然できなくて最悪"
→ "なかなか上手くいかなくて大変だった" ✅ 自然

"今日はバカみたいに疲れた"
→ "今日はとても疲れた" ✅ 自然
```

```yaml
メリット:
  ✅ 自然な変換
  ✅ 文脈を理解
  ✅ 複雑な文章もOK
  ✅ パターン追加不要
  ✅ どんな言葉にも対応

デメリット:
  ❌ 月$2程度のコスト（Phase 3で）
  ❌ 1-2秒のレイテンシ
  ❌ オンライン必須
  ❌ APIキー管理必要
```

## 推奨: ハイブリッド方式

### Phase 1: 正規表現のみ（開発3-4日）

```yaml
理由:
  ✅ 開発速い（2時間で実装）
  ✅ コスト$0
  ✅ MVPには十分

実装:
  シンプルな辞書（50単語）
  「クソ」→「とても」など
```

### Phase 2: AI導入（+1日開発）

```yaml
理由:
  ✅ ユーザー増えてから
  ✅ 月$2でも価値ある
  ✅ 変換品質が差別化ポイント

実装:
  OpenAI API
  Firebase Functions
  キャッシュ機能（同じ文章は再利用）
```

## キャッシュでさらにコスト削減

```javascript
// 同じ文章は変換結果をキャッシュ
const conversionCache = new Map();

async function convertText(text) {
  // キャッシュチェック
  if (conversionCache.has(text)) {
    return conversionCache.get(text);
  }

  // AI変換
  const converted = await callOpenAI(text);

  // キャッシュ保存
  conversionCache.set(text, converted);

  return converted;
}

// 効果:
// 同じ文章「クソ難しかった」が10回投稿されても
// AI呼び出しは1回だけ
// コスト削減: 90%
```

## レイテンシ対策

### 問題

```yaml
投稿ボタン押す
→ AI変換（1-2秒待つ）
→ 通知表示
→ 投稿

ユーザー: 「遅い...」
```

### 解決策A: プログレス表示

```javascript
// 投稿ボタン押す
showLoading("優しい言葉に変換中...✨");

// AI変換（1-2秒）
const converted = await convertText(text);

hideLoading();
showNotification(...);
```

### 解決策B: 並列処理

```javascript
// 投稿ボタン押す
const [converted, imageUploaded] = await Promise.all([
  convertText(text),
  uploadImage(photo)
]);

// 両方終わったら通知
showNotification(...);
```

## 実装の優先順位

### Phase 1（MVP - 3-4日）

```yaml
実装:
  ✅ 正規表現版のみ（シンプル辞書50単語）
  ✅ コスト$0
  ✅ 2時間で実装完了

理由:
  - まずは動くものを作る
  - βテストで反応見る
  - AI必要性を検証
```

### Phase 1.5（改善 - +1日）

```yaml
実装:
  ✅ OpenAI API導入
  ✅ Firebase Functions
  ✅ キャッシュ機能

理由:
  - ユーザーから「変換が不自然」フィードバック
  - 月$2で大幅改善できる
  - 差別化ポイントになる
```

## 最終推奨

```yaml
✅ Phase 1: 正規表現版で開始
  - 開発速い
  - コスト$0
  - MVPには十分

✅ Phase 1.5（1-2週間後）: AI版に移行
  - ユーザー反応見てから
  - 月$2程度（激安）
  - 自然な変換で差別化

✅ ハイブリッド方式も検討
  - 簡単な変換: 正規表現（無料、速い）
  - 複雑な文章: AI（高品質）
```

## コスト総括

```yaml
Phase 1（100ユーザー）:
  正規表現版: $0/月
  AI版: $0/月（無視できる金額）

Phase 2（1,000ユーザー）:
  正規表現版: $0/月
  AI版: $0.15/月 ≈ $0

Phase 3（10,000ユーザー）:
  正規表現版: $0/月
  AI版: $1.50/月
  → 許容範囲 ✅

Phase 4（100,000ユーザー）:
  正規表現版: $0/月
  AI版: $15/月
  → まだ安い ✅

結論:
  AI使っても激安
  月$2で自然な変換は超お得
  差別化ポイントになる
```

## 決定事項（提案）

```yaml
Phase 1（今週末）:
  実装: 正規表現版
  理由: 速い、無料、MVPには十分

Phase 1.5（2週間後）:
  実装: AI版（OpenAI GPT-4o-mini）
  理由: 月$2で自然な変換、差別化

キャッシュ:
  同じ文章は再利用
  コスト90%削減

通知:
  「優しい言葉に変換されました✨」
  変更前・変更後を表示
  [投稿する] [修正する]
```
