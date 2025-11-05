# 主要機能のフローチャート

## 1. ユーザー認証フロー

```mermaid
flowchart TD
    Start([アプリ起動]) --> CheckAuth{認証状態確認}

    CheckAuth -->|ログイン済み| LoadUser[ユーザー情報取得]
    CheckAuth -->|未ログイン| ShowLogin[ログイン画面表示]

    LoadUser --> CheckProfile{プロフィール<br/>設定済み?}
    CheckProfile -->|Yes| MainApp[メイン画面へ]
    CheckProfile -->|No| NicknameSetup[ニックネーム設定]

    ShowLogin --> SelectAuth{認証方法選択}
    SelectAuth -->|Google| GoogleAuth[Google認証]
    SelectAuth -->|Apple| AppleAuth[Apple認証]

    GoogleAuth --> AuthSuccess{認証成功?}
    AppleAuth --> AuthSuccess

    AuthSuccess -->|Yes| SaveToFirestore[Firestoreに<br/>ユーザー情報保存]
    AuthSuccess -->|No| ShowError[エラー表示]

    ShowError --> ShowLogin

    SaveToFirestore --> CheckFirst{初回ログイン?}
    CheckFirst -->|Yes| NicknameSetup
    CheckFirst -->|No| MainApp

    NicknameSetup --> InputNickname[ニックネーム入力]
    InputNickname --> SelectAvatar[アイコン選択]
    SelectAvatar --> UpdateProfile[プロフィール更新]
    UpdateProfile --> MainApp

    MainApp --> End([メイン画面])
```

---

## 2. 動画投稿フロー

```mermaid
flowchart TD
    Start([投稿タブ選択]) --> ShowOptions[投稿方法選択]

    ShowOptions --> Choice{選択}
    Choice -->|今すぐ撮影| CameraPermission{カメラ<br/>権限あり?}
    Choice -->|カメラロール| GalleryPermission{メディア<br/>権限あり?}

    CameraPermission -->|No| RequestCamera[権限リクエスト]
    CameraPermission -->|Yes| OpenCamera[カメラ起動]
    RequestCamera --> CameraGranted{許可?}
    CameraGranted -->|Yes| OpenCamera
    CameraGranted -->|No| ShowError1[エラー表示]
    ShowError1 --> ShowOptions

    GalleryPermission -->|No| RequestGallery[権限リクエスト]
    GalleryPermission -->|Yes| OpenGallery[カメラロール開く]
    RequestGallery --> GalleryGranted{許可?}
    GalleryGranted -->|Yes| OpenGallery
    GalleryGranted -->|No| ShowError2[エラー表示]
    ShowError2 --> ShowOptions

    OpenCamera --> StartRecording[録画開始]
    StartRecording --> RecordingLoop{録画中}
    RecordingLoop -->|30秒経過| StopRecording[自動停止]
    RecordingLoop -->|手動停止| StopRecording
    RecordingLoop -->|録画中| UpdateTimer[残り時間更新]
    UpdateTimer --> RecordingLoop

    StopRecording --> SaveTemp[一時保存]
    SaveTemp --> Preview

    OpenGallery --> SelectVideo[動画選択]
    SelectVideo --> CheckDuration{30秒以内?}
    CheckDuration -->|No| ShowError3[エラー:<br/>30秒以内にしてください]
    CheckDuration -->|Yes| Preview[プレビュー画面]
    ShowError3 --> OpenGallery

    Preview --> PreviewChoice{ユーザー選択}
    PreviewChoice -->|撮り直す/戻る| ShowOptions
    PreviewChoice -->|投稿する| MetadataInput[メタデータ入力]

    MetadataInput --> CategorySelect[カテゴリ選択]
    CategorySelect --> CaptionInput[コメント入力<br/>50文字まで]
    CaptionInput --> AudioToggle[音声ON/OFF]
    AudioToggle --> ConfirmUpload{投稿確認}

    ConfirmUpload -->|キャンセル| MetadataInput
    ConfirmUpload -->|投稿| StartUpload[アップロード開始]

    StartUpload --> GetSignedUrl[Firebase Functionsに<br/>署名付きURLリクエスト]
    GetSignedUrl --> FunctionSuccess{成功?}
    FunctionSuccess -->|No| UploadError[エラー表示]
    UploadError --> RetryChoice{リトライ?}
    RetryChoice -->|Yes| StartUpload
    RetryChoice -->|No| ShowOptions

    FunctionSuccess -->|Yes| UploadToS3[S3へ動画アップロード]
    UploadToS3 --> ShowProgress[進捗表示<br/>0-100%]
    ShowProgress --> S3Success{成功?}

    S3Success -->|No| UploadError
    S3Success -->|Yes| SaveMetadata[Firestoreに<br/>メタデータ保存]

    SaveMetadata --> UpdateUserStats[ユーザー統計更新<br/>totalPosts++]
    UpdateUserStats --> UploadComplete[アップロード完了]
    UploadComplete --> ShowSuccess[成功メッセージ]
    ShowSuccess --> NavigateHome[ホーム画面へ遷移]
    NavigateHome --> End([完了])
```

---

## 3. 動画視聴フロー（バブルUI）

```mermaid
flowchart TD
    Start([ホームタブ選択]) --> LoadVideos[動画メタデータ取得]

    LoadVideos --> CheckCategory{カテゴリ<br/>フィルター?}
    CheckCategory -->|すべて| QueryAll[全動画を<br/>ランダム取得]
    CheckCategory -->|特定カテゴリ| QueryCategory[指定カテゴリで<br/>ランダム取得]

    QueryAll --> LoadSuccess{取得成功?}
    QueryCategory --> LoadSuccess

    LoadSuccess -->|No| ShowError[エラー表示]
    ShowError --> RetryLoad{リトライ?}
    RetryLoad -->|Yes| LoadVideos
    RetryLoad -->|No| End1([終了])

    LoadSuccess -->|Yes| CheckEmpty{動画あり?}
    CheckEmpty -->|No| ShowEmpty[まだ動画がありません]
    ShowEmpty --> End1

    CheckEmpty -->|Yes| ShowBubbles[バブル一覧表示<br/>ふわふわアニメーション]

    ShowBubbles --> BubbleAction{ユーザー操作}
    BubbleAction -->|バブルタップ| OpenModal[動画プレイヤー<br/>モーダル起動]
    BubbleAction -->|リフレッシュ| LoadVideos
    BubbleAction -->|カテゴリ変更| LoadVideos

    OpenModal --> PlayVideo[動画再生開始]
    PlayVideo --> ShowUI[UI表示:<br/>右側: いいね/通報<br/>下部: ユーザー情報<br/>上部: 閉じるボタン]

    ShowUI --> WatchVideo{視聴中}

    WatchVideo -->|上スワイプ| NextVideo[次の動画へ]
    WatchVideo -->|下スワイプ| PrevVideo[前の動画へ]
    WatchVideo -->|いいねタップ| LikeVideo[いいね処理]
    WatchVideo -->|通報タップ| ReportVideo[通報処理]
    WatchVideo -->|動画終了| AutoNext[自動的に次へ]
    WatchVideo -->|✕ボタン| CloseModal[モーダルを閉じる]

    CloseModal --> ShowBubbles

    NextVideo --> LoadNext{次の動画あり?}
    LoadNext -->|Yes| PlayVideo
    LoadNext -->|No| LoadMore[追加読み込み]
    LoadMore --> PlayVideo

    PrevVideo --> LoadPrev{前の動画あり?}
    LoadPrev -->|Yes| PlayVideo
    LoadPrev -->|No| ShowUI

    AutoNext --> NextVideo

    LikeVideo --> CheckLiked{既にいいね済み?}
    CheckLiked -->|Yes| ShowUI
    CheckLiked -->|No| AddLike[Firestoreに<br/>いいね追加]
    AddLike --> IncrementCount[動画のいいね数+1]
    IncrementCount --> SendNotification[投稿者に通知]
    SendNotification --> AnimateLike[いいねアニメーション]
    AnimateLike --> ShowUI

    ReportVideo --> ShowReportDialog[通報理由選択]
    ShowReportDialog --> ReasonChoice{理由選択}
    ReasonChoice -->|キャンセル| ShowUI
    ReasonChoice -->|理由選択| SaveReport[Firestoreに通報保存]
    SaveReport --> HideVideo[この動画を非表示]
    HideVideo --> NextVideo
```

---

## 4. マイページ表示フロー

```mermaid
flowchart TD
    Start([マイページタブ選択]) --> LoadProfile[プロフィール情報取得]

    LoadProfile --> LoadStats[統計情報取得]
    LoadStats --> LoadMyVideos[自分の投稿動画取得]

    LoadMyVideos --> CalculateStreak[連続投稿日数計算]

    CalculateStreak --> Display[表示]
    Display --> ShowProfile[プロフィール情報:<br/>アイコン、ニックネーム]
    ShowProfile --> ShowStats[統計:<br/>今日の投稿、総投稿、<br/>総いいね、連続投稿]
    ShowStats --> ShowVideos[投稿履歴<br/>サムネイル一覧]

    ShowVideos --> UserAction{ユーザー操作}

    UserAction -->|編集ボタン| EditProfile[プロフィール編集]
    UserAction -->|動画タップ| VideoDetail[動画詳細表示]
    UserAction -->|削除ボタン| ConfirmDelete{削除確認}

    EditProfile --> EditNickname[ニックネーム変更]
    EditNickname --> EditAvatar[アイコン変更]
    EditAvatar --> EditBio[一言紹介変更]
    EditBio --> SaveProfile[保存]
    SaveProfile --> UpdateFirestore[Firestore更新]
    UpdateFirestore --> Display

    VideoDetail --> DetailActions{操作}
    DetailActions -->|閉じる| ShowVideos
    DetailActions -->|削除| ConfirmDelete

    ConfirmDelete -->|キャンセル| ShowVideos
    ConfirmDelete -->|削除実行| DeleteFromFirestore[Firestoreから削除]
    DeleteFromFirestore --> DeleteFromS3[S3から動画削除]
    DeleteFromS3 --> UpdateStats[統計を再計算]
    UpdateStats --> Display

    Display --> End([表示中])
```

---

## 5. プッシュ通知フロー

```mermaid
flowchart TD
    Start([アプリ起動]) --> CheckPermission{通知権限あり?}

    CheckPermission -->|No| RequestPermission[権限リクエスト]
    CheckPermission -->|Yes| GetToken[FCMトークン取得]

    RequestPermission --> Granted{許可?}
    Granted -->|No| SkipNotification[通知機能スキップ]
    Granted -->|Yes| GetToken

    GetToken --> SaveToken[Firestoreに<br/>トークン保存]
    SaveToken --> ListenNotification[通知待機]

    SkipNotification --> End1([通知なし])

    ListenNotification --> TriggerEvent{イベント発生}

    TriggerEvent -->|いいね| LikeEvent[他ユーザーが<br/>いいねをした]
    TriggerEvent -->|リマインダー| ReminderEvent[作業リマインダー<br/>時刻に達した]

    LikeEvent --> CheckSettings1{いいね通知ON?}
    CheckSettings1 -->|No| ListenNotification
    CheckSettings1 -->|Yes| SendLikeNotif[FCM送信:<br/>@ユーザーがいいね]

    ReminderEvent --> CheckSettings2{リマインダーON?}
    CheckSettings2 -->|No| ListenNotification
    CheckSettings2 -->|Yes| SendReminder[FCM送信:<br/>今日まだ投稿してないよ]

    SendLikeNotif --> ShowNotification[通知バナー表示]
    SendReminder --> ShowNotification

    ShowNotification --> UserReaction{ユーザー操作}
    UserReaction -->|タップ| OpenApp[アプリ起動]
    UserReaction -->|無視| ListenNotification

    OpenApp --> DetermineAction{通知種類}
    DetermineAction -->|いいね| NavigateToVideo[該当動画へ遷移]
    DetermineAction -->|リマインダー| NavigateToUpload[投稿画面へ遷移]

    NavigateToVideo --> End2([完了])
    NavigateToUpload --> End2
```

---

## 6. エラーハンドリングフロー

```mermaid
flowchart TD
    Start([エラー発生]) --> ErrorType{エラー種類}

    ErrorType -->|ネットワークエラー| NetworkError[ネットワークエラー]
    ErrorType -->|認証エラー| AuthError[認証エラー]
    ErrorType -->|権限エラー| PermissionError[権限エラー]
    ErrorType -->|サーバーエラー| ServerError[サーバーエラー]

    NetworkError --> ShowNetworkMsg[エラーメッセージ:<br/>ネットワークに接続できません]
    ShowNetworkMsg --> RetryOption1[リトライボタン表示]
    RetryOption1 --> UserChoice1{ユーザー選択}
    UserChoice1 -->|リトライ| CheckConnection[接続確認]
    UserChoice1 -->|キャンセル| End1([中断])

    CheckConnection --> Connected{接続OK?}
    Connected -->|Yes| RetryOperation[処理を再実行]
    Connected -->|No| ShowNetworkMsg

    AuthError --> ShowAuthMsg[エラーメッセージ:<br/>認証に失敗しました]
    ShowAuthMsg --> ClearAuth[認証情報クリア]
    ClearAuth --> NavigateLogin[ログイン画面へ]
    NavigateLogin --> End2([再ログイン])

    PermissionError --> ShowPermMsg[エラーメッセージ:<br/>権限が必要です]
    ShowPermMsg --> OpenSettings[設定画面へ誘導]
    OpenSettings --> End3([設定画面へ])

    ServerError --> ShowServerMsg[エラーメッセージ:<br/>サーバーエラー]
    ShowServerMsg --> RetryOption2[リトライボタン表示]
    RetryOption2 --> UserChoice2{ユーザー選択}
    UserChoice2 -->|リトライ| RetryOperation
    UserChoice2 -->|キャンセル| End4([中断])

    RetryOperation --> Success{成功?}
    Success -->|Yes| End5([正常処理])
    Success -->|No| ErrorType
```

---

## 7. S3アップロードの詳細フロー

```mermaid
flowchart TD
    Start([アップロード開始]) --> PrepareVideo[動画ファイル準備]

    PrepareVideo --> CompressCheck{ファイルサイズ確認}
    CompressCheck -->|大きすぎる| ShowCompress[圧縮中表示]
    CompressCheck -->|OK| GenerateId

    ShowCompress --> CompressVideo[動画圧縮]
    CompressVideo --> GenerateId[動画ID生成]

    GenerateId --> CallFunction[Firebase Functions呼び出し:<br/>getUploadUrl]

    CallFunction --> FunctionProcess[Functions処理]
    FunctionProcess --> ValidateUser[ユーザー認証確認]
    ValidateUser --> AuthValid{認証OK?}

    AuthValid -->|No| Return401[401エラー返却]
    Return401 --> ShowAuthError[認証エラー表示]
    ShowAuthError --> End1([失敗])

    AuthValid -->|Yes| GenerateS3Url[S3署名付きURL生成]
    GenerateS3Url --> SetExpiry[有効期限: 15分]
    SetExpiry --> ReturnUrl[URL返却]

    ReturnUrl --> ReceiveUrl[フロントエンドで受信]
    ReceiveUrl --> ReadFile[動画ファイル読み込み]
    ReadFile --> CreateBlob[Blob作成]

    CreateBlob --> StartS3Upload[S3へPUTリクエスト]
    StartS3Upload --> UploadLoop{アップロード中}

    UploadLoop -->|進行中| UpdateProgress[進捗更新]
    UpdateProgress --> ShowProgress[プログレスバー表示]
    ShowProgress --> UploadLoop

    UploadLoop -->|完了| UploadSuccess[アップロード成功]
    UploadLoop -->|エラー| UploadFailed[アップロード失敗]

    UploadFailed --> RetryCount{リトライ回数<3?}
    RetryCount -->|Yes| WaitRetry[3秒待機]
    WaitRetry --> StartS3Upload
    RetryCount -->|No| ShowUploadError[エラー表示]
    ShowUploadError --> End2([失敗])

    UploadSuccess --> BuildCFUrl[CloudFront URL構築]
    BuildCFUrl --> SaveFirestore[Firestoreに保存]

    SaveFirestore --> CreateVideoDoc[videosコレクションに<br/>ドキュメント作成]
    CreateVideoDoc --> UpdateUserDoc[usersコレクションの<br/>totalPosts更新]
    UpdateUserDoc --> UpdateStreak[連続投稿日数更新]

    UpdateStreak --> FirestoreSuccess{保存成功?}
    FirestoreSuccess -->|No| ShowFirestoreError[エラー表示]
    ShowFirestoreError --> End3([失敗])

    FirestoreSuccess -->|Yes| ShowSuccessMsg[成功メッセージ]
    ShowSuccessMsg --> End4([成功])
```

---

これらのフローチャートを参考に開発を進めてください！各フローは実際の実装でそのまま使える構造になっています。
