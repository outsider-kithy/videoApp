import { useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Button } from 'react-native-paper';

export default function App() {
  const cameraRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [onRec, setOnRec] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>アプリがカメラへのアクセスを求めています。</Text>
        <Button onPress={requestPermission} title="許可" />
      </View>
    );
  }

  const startRecord = async () => {
    let options = {
      maxDuration: 10,
      maxFileSize: 100 * 1024 * 1024,
    };
    if (cameraRef.current) {
        //録画中フラグのonRecをtrueにする
        setOnRec(true);
      try {
        const data = await cameraRef.current.recordAsync(options);
        console.log(data);
        setVideo(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //撮影終了
  const stopRecord = () => {
    cameraRef.current.stopRecording();
    //録画中フラグのonRecをfalseにする
    setOnRec(false);
    console.log("録画を終了しました");
  }

  //動画を保存する
  const saveRecord = async () => {
    if(video){
      try {
        const asset =  await MediaLibrary.createAssetAsync(video.uri);
        console.log(asset);
        Alert.alert('保存完了', '動画を保存しました', [
          {text: '閉じる', onPress: () => console.log('Cancel Pressed'),},
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        setVideo(null);
        console.log("保存しました");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
      style={styles.camera} 
      ref={cameraRef} 
      mode='video'
      mute={true}
      > 
          {/* 上部のオーバーレイ */}
          <TouchableOpacity style={styles.overlayTop}>
            <Text style={styles.text}>分類したい物体を撮影してください</Text>
            {onRec && <Text style={styles.onRec}>録画中</Text>}
          </TouchableOpacity>
          {/* 下部のオーバーレイ */}
          <TouchableOpacity style={styles.overlayBottom}>
            {!onRec && <Button icon="camera" mode="contained" style={styles.takeButton} onPress={startRecord}>撮影</Button>}
            {onRec && <Button icon="camera" mode="contained" style={styles.stopButton} onPress={stopRecord}>終了</Button>}
            {/* 撮影した画像を表示 */}
            <View style={styles.saveContainer}>
              {/* videoがある場合だけ表示 */}
              {video && <Button icon="file" mode="contained" style={styles.saveButton} onPress={saveRecord}>保存</Button>}
            </View>
          </TouchableOpacity>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  saveContainer: {
    marginTop: 16,
    marginBottom :16,
  },
  camera: {
    flex: 1,
  },
  overlayTop:{
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  overlayBottom:{
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  takeButton: {
    color: '#fff',
    backgroundColor: '#ff0000',
    width: 100,
    marginTop: 16,
  },
  stopButton: {
    color: '#fff',
    width: 100,
    marginTop: 16,
  },
  saveButton: {
    color: '#fff',
    width: 100,
    marginTop: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  onRec:{
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  }
});
