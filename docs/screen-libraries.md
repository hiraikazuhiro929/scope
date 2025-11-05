# 画面別ライブラリ・コンポーネント一覧

## 必須ライブラリの全リスト

### package.json（完全版）

```json
{
  "name": "scope-app",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    // ===== 基本（必須）=====
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "react-native-web": "~0.19.10",

    // ===== ナビゲーション（必須）=====
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/stack": "^6.3.20",
    "react-native-screens": "~3.31.1",
    "react-native-safe-area-context": "4.10.1",

    // ===== 状態管理（必須）=====
    "zustand": "^4.5.2",

    // ===== Firebase（必須）=====
    "firebase": "^10.12.0",

    // ===== 動画関連（必須）=====
    "expo-camera": "~15.0.10",
    "expo-image-picker": "~15.0.5",
    "expo-av": "~14.0.5",
    "expo-media-library": "~16.0.3",
    "expo-file-system": "~17.0.1",

    // ===== UI/UXアニメーション（必須）=====
    "react-native-gesture-handler": "~2.16.1",
    "react-native-reanimated": "~3.10.1",

    // ===== リスト表示（推奨）=====
    "@shopify/flash-list": "1.6.4",

    // ===== その他UI（推奨）=====
    "expo-linear-gradient": "~13.0.2",
    "expo-blur": "~13.0.2",
    "react-native-modal": "^13.0.1",

    // ===== アップロード用（必須）=====
    "axios": "^1.6.8",

    // ===== 日時処理（推奨）=====
    "dayjs": "^1.11.10",

    // ===== その他Expo（必須）=====
    "expo-constants": "~16.0.1",
    "expo-status-bar": "~1.12.1",
    "expo-splash-screen": "~0.27.4",
    "expo-font": "~12.0.5",
    "expo-notifications": "~0.28.1",
    "@react-native-async-storage/async-storage": "1.23.1"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~18.2.79"
  }
}
```

---

## 画面別使用ライブラリ

### 1. ログイン画面（LoginScreen）

**使用ライブラリ**:
- `firebase/auth` - Google/Apple認証
- `expo-constants` - アプリ情報取得
- `zustand` - 認証状態管理

**必要なコンポーネント**:
```javascript
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthStore } from '../stores/authStore';
```

**画面構成**:
- ロゴ画像
- Googleログインボタン
- Appleログインボタン
- 利用規約リンク

---

### 2. ホーム画面（HomeScreen） - バブルUI + 動画視聴

**使用ライブラリ**:
- `expo-av` - 動画再生
- `react-native-gesture-handler` - スワイプ操作
- `react-native-reanimated` - ふわふわアニメーション
- `expo-linear-gradient` - バブルのグラデーション縁取り
- `firebase/firestore` - 動画メタデータ取得

**必要なコンポーネント**:
```javascript
import { Video } from 'expo-av';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, query, getDocs } from 'firebase/firestore';
```

**重要な実装ポイント**:
- **バブル一覧画面**: ふわふわ浮かぶ丸いサムネイル
- **タップでモーダル起動**: フルスクリーン動画プレイヤー
- **縦スワイプで動画切り替え**: モーダル内で次の動画へ
- **いいねボタンのアニメーション**
- **通報ボタン**
- **閉じるボタン**: バブル一覧に戻る

#### 2-1. バブル一覧画面

**レイアウト**:
```javascript
const HomeScreen = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.logo}>🔍 Scope</Text>
        <Picker selectedValue={category} onValueChange={setCategory}>
          <Picker.Item label="すべて" value="all" />
          <Picker.Item label="💻プログラミング" value="programming" />
        </Picker>
      </View>

      {/* 浮かぶバブル群 */}
      <View style={styles.bubblesContainer}>
        {videos.map((video, index) => (
          <FloatingBubble
            key={video.videoId}
            video={video}
            index={index}
            onPress={() => openVideoPlayer(video, index)}
          />
        ))}
      </View>

      {/* リフレッシュボタン */}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchVideos}>
        <Text style={styles.refreshIcon}>🔄</Text>
      </TouchableOpacity>

      {/* 動画プレイヤーモーダル */}
      <Modal visible={isPlaying} animationType="fade" presentationStyle="fullScreen">
        <VideoPlayerScreen
          videos={videos}
          initialIndex={selectedVideo?.index || 0}
          onClose={() => setIsPlaying(false)}
        />
      </Modal>
    </View>
  );
};
```

**FloatingBubble コンポーネント**:
```javascript
const FloatingBubble = ({ video, onPress, index }) => {
  const bubbleSize = 80 + Math.random() * 40; // 80-120px
  const randomX = Math.random() * (width - bubbleSize - 32) + 16;
  const randomY = Math.random() * (height - 200 - bubbleSize) + 100;

  // ふわふわアニメーション
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(Math.random() * 20 - 10, {
        duration: 2000 + Math.random() * 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    translateX.value = withRepeat(
      withTiming(Math.random() * 15 - 7.5, {
        duration: 2500 + Math.random() * 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View style={[styles.bubbleContainer, { left: randomX, top: randomY, width: bubbleSize, height: bubbleSize }, animatedStyle]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.bubble}>
          <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnailImage} />
          <LinearGradient
            colors={['rgba(52, 152, 219, 0.5)', 'rgba(231, 76, 60, 0.5)']}
            style={styles.bubbleBorder}
          />
        </View>
        <View style={styles.bubbleInfo}>
          <Text style={styles.nickname} numberOfLines={1}>@{video.userNickname}</Text>
          <Text style={styles.likes}>👍 {video.likes}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
```

#### 2-2. 動画プレイヤーモーダル

**レイアウト**:
```javascript
const VideoPlayerScreen = ({ videos, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* 閉じるボタン */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={{ fontSize: 24, color: '#fff' }}>✕</Text>
      </TouchableOpacity>

      {/* 縦スワイプ可能な動画プレイヤー */}
      <GestureDetector gesture={swipeGesture}>
        <Video
          source={{ uri: videos[currentIndex].videoUrl }}
          shouldPlay
          isLooping={false}
          resizeMode="cover"
          style={{ flex: 1 }}
        />
      </GestureDetector>

      {/* 右側のボタン */}
      <View style={styles.rightButtons}>
        <TouchableOpacity onPress={handleLike}>
          <Text style={styles.buttonIcon}>👍</Text>
          <Text style={styles.buttonText}>{videos[currentIndex].likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleReport}>
          <Text style={styles.buttonIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* 下部情報 */}
      <View style={styles.bottomInfo}>
        <Text style={styles.nickname}>@{videos[currentIndex].userNickname}</Text>
        <Text style={styles.caption}>{videos[currentIndex].caption}</Text>
      </View>
    </View>
  );
};
```

---

### 3. 投稿画面（UploadScreen）

#### 3-1. 投稿選択画面

**使用ライブラリ**:
- `react-native` - 基本UI

**画面構成**:
```javascript
<View>
  <TouchableOpacity onPress={openCamera}>
    📹 今すぐ撮影
  </TouchableOpacity>

  <TouchableOpacity onPress={openGallery}>
    📁 カメラロールから選ぶ
  </TouchableOpacity>
</View>
```

#### 3-2. カメラ撮影画面

**使用ライブラリ**:
- `expo-camera` - カメラ制御
- `expo-av` - 動画録画

**必要なコンポーネント**:
```javascript
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Video } from 'expo-av';
```

**実装例**:
```javascript
const [isRecording, setIsRecording] = useState(false);
const [recordedVideo, setRecordedVideo] = useState(null);
const cameraRef = useRef(null);

const startRecording = async () => {
  if (cameraRef.current) {
    setIsRecording(true);
    const video = await cameraRef.current.recordAsync({
      maxDuration: 30,
      quality: '720p'
    });
    setRecordedVideo(video);
    setIsRecording(false);
  }
};

return (
  <View style={{ flex: 1 }}>
    <CameraView
      ref={cameraRef}
      style={{ flex: 1 }}
      facing="back"
      mode="video"
    />

    {/* 録画コントロール */}
    <View style={styles.controls}>
      <Text>{remainingTime}秒</Text>
      <TouchableOpacity onPress={startRecording}>
        ● 録画開始
      </TouchableOpacity>
    </View>
  </View>
);
```

#### 3-3. カメラロール選択画面

**使用ライブラリ**:
- `expo-image-picker` - カメラロール選択

**実装例**:
```javascript
import * as ImagePicker from 'expo-image-picker';

const pickVideo = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    videoMaxDuration: 30,
    quality: 0.8,
    allowsEditing: true
  });

  if (!result.canceled) {
    setSelectedVideo(result.assets[0]);
  }
};
```

#### 3-4. プレビュー画面

**使用ライブラリ**:
- `expo-av` - 動画プレビュー再生

**画面構成**:
```javascript
<View style={{ flex: 1 }}>
  <Video
    source={{ uri: videoUri }}
    shouldPlay
    isLooping
    resizeMode="cover"
    style={{ flex: 1 }}
  />

  <View style={styles.buttons}>
    <Button title="撮り直す" onPress={retake} />
    <Button title="投稿する" onPress={goToMetadata} />
  </View>
</View>
```

#### 3-5. メタデータ入力画面

**使用ライブラリ**:
- `react-native` - TextInput, Picker
- `firebase/firestore` - データ保存
- `axios` - S3アップロード

**画面構成**:
```javascript
<ScrollView>
  {/* カテゴリ選択 */}
  <Text>カテゴリを選択</Text>
  <Picker
    selectedValue={category}
    onValueChange={setCategory}
  >
    <Picker.Item label="プログラミング" value="programming" />
    <Picker.Item label="デザイン" value="design" />
    {/* ... */}
  </Picker>

  {/* コメント入力 */}
  <TextInput
    placeholder="一言コメント（50文字まで）"
    maxLength={50}
    value={caption}
    onChangeText={setCaption}
  />

  {/* 音声ON/OFF */}
  <Switch
    value={hasAudio}
    onValueChange={setHasAudio}
  />

  {/* アップロードボタン */}
  <Button title="投稿する" onPress={uploadVideo} />

  {/* プログレスバー */}
  {uploading && (
    <View>
      <Text>{uploadProgress}%</Text>
      <ProgressBar progress={uploadProgress / 100} />
    </View>
  )}
</ScrollView>
```

**アップロード処理**:
```javascript
const uploadVideo = async () => {
  try {
    setUploading(true);

    // 1. Firebase Functionsから署名付きURL取得
    const response = await fetch('https://your-function-url/getUploadUrl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.uid })
    });
    const { uploadUrl, s3Key } = await response.json();

    // 2. S3に直接アップロード
    const videoBlob = await fetch(videoUri).then(r => r.blob());
    await axios.put(uploadUrl, videoBlob, {
      headers: { 'Content-Type': 'video/mp4' },
      onUploadProgress: (progressEvent) => {
        const percent = (progressEvent.loaded / progressEvent.total) * 100;
        setUploadProgress(Math.round(percent));
      }
    });

    // 3. Firestoreにメタデータ保存
    const cloudFrontUrl = `https://your-cloudfront.net/${s3Key}`;
    await addDoc(collection(db, 'videos'), {
      videoId: generateId(),
      userId: user.uid,
      userNickname: user.nickname,
      category,
      caption,
      videoUrl: cloudFrontUrl,
      s3Key,
      uploadedAt: serverTimestamp()
    });

    setUploading(false);
    navigation.navigate('Home');
  } catch (error) {
    console.error(error);
    setUploading(false);
  }
};
```

---

### 4. マイページ画面（ProfileScreen）

**使用ライブラリ**:
- `firebase/firestore` - ユーザー情報・統計取得
- `@shopify/flash-list` - 投稿履歴一覧
- `expo-av` - 動画サムネイル

**画面構成**:
```javascript
<ScrollView>
  {/* プロフィール情報 */}
  <View style={styles.header}>
    <Image source={avatarIcon} />
    <Text>@{nickname}</Text>
    <Button title="プロフィール編集" />
  </View>

  {/* 統計 */}
  <View style={styles.stats}>
    <Text>📊 今日の投稿: {todayPosts}回</Text>
    <Text>💯 総投稿数: {totalPosts}回</Text>
    <Text>❤️ 総いいね: {totalLikes}</Text>
    <Text>🔥 連続投稿: {currentStreak}日</Text>
  </View>

  {/* 投稿履歴 */}
  <Text>自分の投稿履歴</Text>
  <FlashList
    data={myVideos}
    renderItem={({ item }) => (
      <TouchableOpacity>
        <Video
          source={{ uri: item.videoUrl }}
          style={{ width: 100, height: 150 }}
        />
        <Button title="削除" onPress={() => deleteVideo(item.id)} />
      </TouchableOpacity>
    )}
    numColumns={3}
  />
</ScrollView>
```

---

### 5. 設定画面（SettingsScreen）

**使用ライブラリ**:
- `firebase/auth` - ログアウト
- `@react-native-async-storage/async-storage` - ローカル設定保存

**画面構成**:
```javascript
<ScrollView>
  <Text>通知</Text>
  <Switch
    value={notificationSettings.likes}
    onValueChange={(val) => updateSetting('likes', val)}
  />
  <Text>いいね通知</Text>

  <Switch
    value={notificationSettings.reminders}
    onValueChange={(val) => updateSetting('reminders', val)}
  />
  <Text>リマインド通知</Text>

  <TouchableOpacity onPress={() => openUrl('https://...')}>
    <Text>利用規約</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => openUrl('https://...')}>
    <Text>プライバシーポリシー</Text>
  </TouchableOpacity>

  <Button title="ログアウト" onPress={logout} />
</ScrollView>
```

---

## 共通コンポーネント

### LoadingSpinner
```javascript
import { ActivityIndicator } from 'react-native';

export const LoadingSpinner = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" color="#3498DB" />
  </View>
);
```

### ErrorMessage
```javascript
export const ErrorMessage = ({ message, onRetry }) => (
  <View style={styles.center}>
    <Text>{message}</Text>
    <Button title="リトライ" onPress={onRetry} />
  </View>
);
```

---

## インストールコマンド

```bash
# プロジェクト作成
npx create-expo-app scope-app
cd scope-app

# ナビゲーション
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context

# 状態管理
npm install zustand

# Firebase
npm install firebase

# 動画関連
npx expo install expo-camera expo-image-picker expo-av expo-media-library expo-file-system

# UI/UX
npx expo install react-native-gesture-handler react-native-reanimated
npm install @shopify/flash-list react-native-modal

# その他
npx expo install expo-linear-gradient expo-blur expo-constants expo-status-bar expo-splash-screen expo-notifications
npm install @react-native-async-storage/async-storage axios dayjs
```

---

## 開発時に役立つTips

### カメラパーミッション取得
```javascript
import { useCameraPermissions } from 'expo-camera';

const [permission, requestPermission] = useCameraPermissions();

if (!permission?.granted) {
  await requestPermission();
}
```

### メディアライブラリパーミッション
```javascript
import * as MediaLibrary from 'expo-media-library';

const [permission, requestPermission] = MediaLibrary.usePermissions();

if (!permission?.granted) {
  await requestPermission();
}
```

### 通知パーミッション
```javascript
import * as Notifications from 'expo-notifications';

const { status } = await Notifications.requestPermissionsAsync();
```
