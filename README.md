# ふわログ (Fuwa Log)

> ふわっと記録、やさしく応援

匿名で作業を記録、写真1枚添付可能。強い言葉は自動で優しく変換。いいねで応援し合う、ふわふわした優しい空間。

---

## 📖 プロジェクト概要

### コンセプト

```yaml
核心的な価値:
  ✅ 匿名で作業記録（有名・無名関係なし）
  ✅ テキスト200文字 + 写真1枚
  ✅ 強い言葉を自動で柔らかく変換
  ✅ いいねで応援（コメント不要）
  ✅ ランダム表示（フォロー機能なし）
  ✅ カレンダーで振り返り
```

### ターゲットユーザー

- 在宅ワーカー、学生、フリーランサー
- 一人での作業に孤独感を感じる人
- 優しい空間でモチベーションを保ちたい人

---

## 🚀 技術スタック

### フロントエンド

```yaml
フレームワーク: React Native (Expo SDK 51)
状態管理: Zustand
UI: Native Components（シンプル）
画像処理: expo-image-picker, expo-image-manipulator
```

### バックエンド

```yaml
認証: Firebase Authentication（Google認証）
データベース: Firestore
ストレージ: Firebase Storage（写真保存）
Functions: Firebase Functions（AI変換用）
```

### AI機能

```yaml
Phase 1: 正規表現による言葉変換
Phase 1.5: OpenAI GPT-4o-mini（自然な変換）
```

---

## 📱 機能仕様

### 核心機能（MVP）

1. **ログイン**
   - Google認証のみ

2. **プロフィール設定**
   - ニックネーム（自由）
   - アイコン（選択式20種類）
   - 一言紹介（50文字）

3. **今日の記録を投稿**
   - テキスト（200文字まで）
   - 写真1枚（任意）
   - カテゴリ選択（任意）
   - 強い言葉を自動変換 → 通知

4. **他人の記録を見る**
   - ランダム表示
   - スワイプで次へ
   - いいねボタン

5. **マイページ**
   - カレンダーで振り返り
   - 連続記録日数
   - 累計いいね数

---

## 🎨 デザイン

### カラーパレット

```yaml
Primary:
  - ふわブルー: #A8D8EA（メイン）
  - ふわピンク: #FFB6C1（アクセント）
  - ふわホワイト: #F8F9FA（背景）

Text:
  - メイン: #333333
  - サブ: #888888
  - プレースホルダー: #CCCCCC

Button:
  - Google: #4285F4
  - プライマリー: #A8D8EA
  - いいね: #FF6B9D
```

### フォント

```yaml
iOS: San Francisco + Hiragino Kaku Gothic ProN
Android: Roboto + Noto Sans JP

サイズ:
  - 大見出し: 32pt
  - 本文: 16pt
  - キャプション: 14pt
```

---

## 📊 開発計画

### Phase 1: MVP（3-4日）

```yaml
Day 1: 基本機能
  - Expo環境構築
  - Firebase設定
  - ログイン画面
  - プロフィール設定

Day 2: 投稿機能
  - 投稿画面
  - 写真添付
  - 言葉変換（正規表現版）
  - Firestore保存

Day 3: 表示・いいね
  - ランダム表示
  - いいね機能
  - マイページ

Day 4: 調整・テスト
  - UI調整
  - バグ修正
  - 実機テスト
```

### Phase 1.5: AI変換（+1日）

```yaml
実装:
  - OpenAI API導入
  - Firebase Functions
  - キャッシュ機能

理由:
  - 自然な言葉変換
  - 差別化ポイント
  - 月$2で実現可能
```

---

## 💰 コスト試算

### Phase 1（100ユーザー）

```yaml
Firebase: $0（無料枠内）
OpenAI: $0（無視できる金額）
合計: $0/月
```

### Phase 2（1,000ユーザー、100投稿/日）

```yaml
Firebase:
  - Firestore: $5/月
  - Storage: $0.02/月
  - 転送: $0（無料枠内）

OpenAI（AI変換使用時）:
  - $0.15/月

合計: $5-10/月
```

### Phase 3（10,000ユーザー、1,000投稿/日）

```yaml
Firebase: $40/月
OpenAI: $1.50/月
合計: $40-50/月
```

---

## 📁 ドキュメント構成

### 分析・検討資料（docs/）

```yaml
コスト・需要分析:
  - realistic-cost-analysis.md（現実的なコスト分析）
  - user-demand-analysis.md（ユーザー需要検証）
  - solo-developer-success-cases.md（個人開発成功事例）

コンセプト検討:
  - why-video-is-too-big.md（動画が重すぎる理由）
  - true-mvp-proposal.md（真のMVP提案）
  - new-concept-work-diary.md（新コンセプト：作業日記）
  - refined-concept-v2.md（改良版コンセプト）

実装検討:
  - app-naming-ideas.md（アプリ名検討）
  - ai-text-conversion-cost.md（AI変換コスト分析）
  - development-approach.md（開発アプローチ）
```

---

## 🎯 成功確率

```yaml
動画版（旧構想）: 2-5%
テキスト+写真版（現構想）: 30-40%

理由:
  ✅ 3-4日で完成（超速い）
  ✅ 技術的にシンプル
  ✅ コスト$0-10/月（激安）
  ✅ 投稿ハードル低い
  ✅ 言葉変換が差別化ポイント
  ✅ 優しい空間が独自性
```

---

## 🚦 次のステップ

### 今すぐできること

1. **超詳細な画面設計書を作成**
   - 全画面のレイアウト
   - コンポーネント仕様
   - サイズ・余白の数値

2. **開発環境構築**
   - Expo初期化
   - Firebase設定
   - 必要なライブラリインストール

3. **実装開始**
   - Day 1から順に開発
   - 4日後にMVP完成

---

## 📜 ライセンス

TBD

---

## 🙏 謝辞

- SuperClaude framework
- React Native / Expo
- Firebase
- OpenAI

---

**開発準備完了！🎉**

次は超詳細な画面設計書を作成して、実装に入ります。
