import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import {
  Play,
  Pause,
  Maximize,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// HLS test URLs - using reliable free streams
const VIDEO_STREAMS = [
  {
    title: 'Big Buck Bunny',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    title: 'Sintel Trailer',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  },
  {
    title: 'Tears of Steel',
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
];

export default function VideoPlayerPage() {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);

  const currentStream = VIDEO_STREAMS[currentStreamIndex];

  const togglePlayback = async () => {
    if (status.isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
  };

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await videoRef.current?.dismissFullscreenPlayer();
    } else {
      await videoRef.current?.presentFullscreenPlayer();
    }
    setIsFullscreen(!isFullscreen);
  };

  const toggleMute = async () => {
    await videoRef.current?.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  const seekBackward = async () => {
    if (status.positionMillis > 10000) {
      await videoRef.current?.setPositionAsync(status.positionMillis - 10000);
    } else {
      await videoRef.current?.setPositionAsync(0);
    }
  };

  const seekForward = async () => {
    const newPosition = status.positionMillis + 10000;
    if (newPosition < status.durationMillis) {
      await videoRef.current?.setPositionAsync(newPosition);
    }
  };

  const switchStream = () => {
    const nextIndex = (currentStreamIndex + 1) % VIDEO_STREAMS.length;
    setCurrentStreamIndex(nextIndex);
    Alert.alert(
      'Stream Changed',
      `Now playing: ${VIDEO_STREAMS[nextIndex].title}`,
      [{ text: 'OK' }]
    );
  };

  const restartVideo = async () => {
    await videoRef.current?.setPositionAsync(0);
    await videoRef.current?.playAsync();
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Player</Text>
        <Text style={styles.headerSubtitle}>HLS streaming with controls</Text>
      </View>

      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: currentStream.uri }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={setStatus}
          shouldPlay={false}
        />

        {/* Video Info Overlay */}
        <View style={styles.videoInfoOverlay}>
          <Text style={styles.videoTitle}>{currentStream.title}</Text>
          {status.durationMillis && (
            <Text style={styles.videoTime}>
              {formatTime(status.positionMillis || 0)} /{' '}
              {formatTime(status.durationMillis)}
            </Text>
          )}
        </View>

        {/* Custom Controls Overlay */}
        <View style={styles.controlsOverlay}>
          <View style={styles.controlsContainer}>
            {/* Seek Controls */}
            <View style={styles.seekControls}>
              <TouchableOpacity
                style={styles.seekButton}
                onPress={seekBackward}
              >
                <SkipBack size={24} color="#FFFFFF" />
                <Text style={styles.seekText}>10s</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playButton}
                onPress={togglePlayback}
              >
                {status.isPlaying ? (
                  <Pause size={32} color="#FFFFFF" />
                ) : (
                  <Play size={32} color="#FFFFFF" />
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.seekButton} onPress={seekForward}>
                <SkipForward size={24} color="#FFFFFF" />
                <Text style={styles.seekText}>10s</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Additional Controls */}
      <View style={styles.additionalControls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
          {isMuted ? (
            <VolumeX size={20} color="#6B7280" />
          ) : (
            <Volume2 size={20} color="#6B7280" />
          )}
          <Text style={styles.controlText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleFullscreen}
        >
          <Maximize size={20} color="#6B7280" />
          <Text style={styles.controlText}>Fullscreen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={restartVideo}>
          <RotateCcw size={20} color="#6B7280" />
          <Text style={styles.controlText}>Restart</Text>
        </TouchableOpacity>
      </View>

      {/* Stream Selection */}
      <View style={styles.streamSelection}>
        <Text style={styles.streamTitle}>Available Streams</Text>
        <TouchableOpacity style={styles.streamButton} onPress={switchStream}>
          <Text style={styles.streamButtonText}>
            Switch Stream ({currentStreamIndex + 1}/{VIDEO_STREAMS.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      {status.durationMillis > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (status.positionMillis / status.durationMillis) * 100
                  }%`,
                },
              ]}
            />
          </View>
         <View>
          <Text style={styles.videoTimeDark}>
              {formatTime(status.positionMillis || 0)} /{' '}
              {formatTime(status.durationMillis)}
            </Text> 
         </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  videoContainer: {
    position: 'relative',
    margin: 15,
    borderRadius: 12,
    backgroundColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    height: width * 0.56, // 16:9 aspect ratio
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoInfoOverlay: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    zIndex: 2,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  videoTime: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  videoTimeDark:{
    color: '#1F2937',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  controlsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  seekControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  seekButton: {
    alignItems: 'center',
  },
  seekText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 2,
  },
  playButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    borderRadius: 30,
    padding: 15,
  },
  additionalControls: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlButton: {
    alignItems: 'center',
    padding: 10,
  },
  controlText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  streamSelection: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  streamButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  streamButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
});
