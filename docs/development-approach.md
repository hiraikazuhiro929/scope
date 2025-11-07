# ふわログ 開発アプローチ

## Figmaの必要性について

### Figmaを作る場合

```yaml
メリット:
  ✅ ビジュアルで確認できる
  ✅ 完成イメージが明確
  ✅ 色・フォント・レイアウトを事前に決定
  ✅ クライアントに見せやすい

デメリット:
  ❌ 時間かかる（1-2日）
  ❌ Figmaスキル必要
  ❌ 結局コード書く必要ある
  ❌ デザイン変更時にFigmaも更新必要

所要時間:
  Figma作成: 1-2日
  コード実装: 3-4日
  合計: 4-6日
```

### Figmaなしで直接コード

```yaml
メリット:
  ✅ 最速（3-4日で完成）
  ✅ 動くものがすぐできる
  ✅ 修正も即反映
  ✅ Figmaスキル不要

デメリット:
  ❌ 完成イメージが見えにくい
  ❌ 後から大きな変更しにくい

所要時間:
  コード実装: 3-4日
  合計: 3-4日
```

## 推奨: パターンB（詳細設計書 + 直接コード）

### Flappy Bird / Wordle 方式

```yaml
彼らの開発手順:
  1. 頭の中でイメージ
  2. いきなりコード書く
  3. 動かしながら調整
  4. 2-3日で完成

結果:
  - Flappy Bird: $50,000/日
  - Wordle: NYTimes買収

教訓:
  デザインツールなしでも成功できる
  重要なのは「動くもの」
```

### 僕らの手順（推奨）

```yaml
Step 1: 超詳細な画面設計書を作る（1時間）
  - 各画面のレイアウト
  - コンポーネント配置
  - カラー・フォント
  - サイズ・余白

Step 2: React Nativeで直接実装（3-4日）
  - 設計書を見ながらコード
  - 動かしながら調整
  - 実機で確認

Step 3: 微調整（半日）
  - 色調整
  - 余白調整
  - アニメーション追加

合計: 3-4日（Figmaなしで最速）
```

## 具体的な進め方

### 今からできること

#### 1. 超詳細な画面設計書を作る

```yaml
内容:
  - 全画面のレイアウト図（テキスト）
  - コンポーネントリスト
  - カラーパレット
  - フォント指定
  - 余白・サイズの具体的な数値
  - タップ時の動き

所要時間: 1-2時間
→ これを見ながら実装すればOK
```

#### 2. React Nativeコードを先に書く

```yaml
メリット:
  ✅ 動くものができる
  ✅ 実機で確認できる
  ✅ デザイン変更も即反映

実装順序:
  Day 1: 基本画面（ログイン、投稿入力）
  Day 2: 投稿機能（写真、変換）
  Day 3: 表示機能（ランダム、いいね）
  Day 4: マイページ、調整
```

#### 3. 後からFigmaにする（オプション）

```yaml
タイミング:
  - アプリ完成後
  - ストア申請時
  - プレゼン資料用

理由:
  動くものがあればFigmaは後でもOK
```

## Figmaを使いたい場合の代替案

### 代替案A: 手書きスケッチ

```yaml
方法:
  1. 紙とペンで画面を描く
  2. スマホで写真撮影
  3. それを見ながらコード

所要時間: 30分

メリット:
  ✅ 超速い
  ✅ 自由度高い
  ✅ ツール不要

参考:
  Instagram初期も手書きスケッチから
```

### 代替案B: Excalidraw（無料・簡単）

```yaml
URL: https://excalidraw.com/

特徴:
  ✅ 無料
  ✅ ブラウザで動く
  ✅ 手書き風
  ✅ 5分で使える

用途:
  - ラフなワイヤーフレーム
  - レイアウト確認

所要時間: 1時間
```

### 代替案C: Figma（学習必要）

```yaml
所要時間:
  学習: 2-3時間
  作成: 1-2日

メリット:
  ✅ プロ品質
  ✅ 再利用可能

デメリット:
  ❌ 時間かかる
  ❌ 学習コスト
```

## 僕が作れる「画面設計書」の例

### ログイン画面の詳細設計

```markdown
# 画面: ログイン

## レイアウト
┌─────────────────────────────┐
│                             │
│         [ロゴ]              │ 中央配置、縦200px位置
│         ふわログ             │ フォント: 32pt, 太字
│                             │
│    ふわっと記録、            │ フォント: 14pt, 細字
│    やさしく応援              │ 色: #888
│                             │
│                             │
│                             │
│  ┌───────────────────────┐  │
│  │  Googleでログイン    │  │ ボタン、横幅80%
│  └───────────────────────┘  │ 高さ: 50px
│                             │ 色: #4285F4
│                             │ フォント: 16pt, 白
│                             │ 角丸: 8px
│                             │
└─────────────────────────────┘

## 詳細仕様

### ロゴ
- アイコン: 雲のイラスト（または絵文字☁️）
- サイズ: 80x80px
- 位置: 画面上から200px
- 中央揃え

### タイトル「ふわログ」
- フォント: Hiragino Kaku Gothic ProN（または Roboto Bold）
- サイズ: 32pt
- 色: #333
- 位置: ロゴの下、20px余白

### サブタイトル
- フォント: Hiragino Kaku Gothic ProN（または Roboto Regular）
- サイズ: 14pt
- 色: #888
- 位置: タイトルの下、10px余白

### Googleログインボタン
- 位置: 画面中央、縦方向は60%位置
- サイズ: 横幅80%（最大320px）、高さ50px
- 背景色: #4285F4（Google Blue）
- テキスト色: #FFFFFF
- フォント: 16pt
- 角丸: 8px
- シャドウ: 0 2px 4px rgba(0,0,0,0.1)
- タップ時: 透明度80%

### アニメーション
- 画面表示時: フェードイン（0.3秒）
- ボタンタップ: スケール95%（0.1秒）

## React Nativeコード（例）

```jsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>☁️</Text>
      <Text style={styles.title}>ふわログ</Text>
      <Text style={styles.subtitle}>ふわっと記録、やさしく応援</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleLogin}
      >
        <Text style={styles.buttonText}>Googleでログイン</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 200,
  },
  logo: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 80,
  },
  button: {
    backgroundColor: '#4285F4',
    width: '80%',
    maxWidth: 320,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```
```

## カラーパレット

```yaml
Primary Colors:
  - ふわブルー: #A8D8EA（メインカラー、雲のイメージ）
  - ふわピンク: #FFB6C1（アクセント、優しい印象）
  - ふわホワイト: #F8F9FA（背景）

Text Colors:
  - メインテキスト: #333333
  - サブテキスト: #888888
  - プレースホルダー: #CCCCCC

Button Colors:
  - Google: #4285F4
  - プライマリー: #A8D8EA
  - セカンダリー: #FFB6C1
  - いいね: #FF6B9D

Status Colors:
  - 成功: #4CAF50
  - 警告: #FF9800
  - エラー: #F44336
```

## フォント

```yaml
iOS:
  - メイン: San Francisco（システムデフォルト）
  - 日本語: Hiragino Kaku Gothic ProN

Android:
  - メイン: Roboto（システムデフォルト）
  - 日本語: Noto Sans JP

サイズ:
  - 大見出し: 32pt
  - 中見出し: 24pt
  - 小見出し: 18pt
  - 本文: 16pt
  - キャプション: 14pt
  - 小さい文字: 12pt
```

## このアプローチの利点

```yaml
✅ Figma不要
✅ 1-2時間で設計書完成
✅ 設計書見ながらコード実装
✅ 3-4日で完成
✅ 修正も即座に反映
✅ 最速でMVP完成
```

## 最終推奨

```yaml
今日中:
  1. 全画面の詳細設計書を作る（僕が作る）
     → テキスト + 図 + コード例

  2. カラー・フォントを決定

  3. 実装順序を決める

明日から:
  Day 1: ログイン + プロフィール設定
  Day 2: 投稿画面 + 変換機能
  Day 3: 表示画面 + いいね
  Day 4: マイページ + 調整

4日後:
  ✅ 動くふわログ完成
  ✅ 実機テスト可能
  ✅ βテスター招待可能
```
