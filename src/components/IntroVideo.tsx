import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward } from 'lucide-react';

interface IntroVideoProps {
  onComplete: () => void;
  colorTheme: 'pink' | 'purple' | 'green' | 'orange' | 'blue';
  gender?: 'male' | 'female';
}

const IntroVideo: React.FC<IntroVideoProps> = ({ onComplete, colorTheme, gender }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [transformStyle, setTransformStyle] = useState({});

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    const playMedia = async () => {
      try {
        await video.play();
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Autoplay failed:", err);
        setIsPlaying(false);
      }
    };

    const handleEnded = () => {
      audio.pause();
      audio.currentTime = 0;
      onComplete();
    };

    video.addEventListener('ended', handleEnded);
    playMedia();

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [onComplete]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    if (isPlaying) {
      video.pause();
      audio.pause();
    } else {
      video.play();
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    onComplete();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -15;
    const rotateY = ((x / rect.width) - 0.5) * 15;

    setTransformStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    });
  };

  const resetTransform = () => {
    setTransformStyle({ transform: `rotateX(0deg) rotateY(0deg)` });
  };

  return (
    <motion.div className="w-full max-w-4xl mx-auto px-4 py-10">
      <motion.div
        ref={cardRef}
        className="relative rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 ease-out"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          backgroundColor: '#0f0f0f',
          color: 'white',
          ...transformStyle,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTransform}
      >
        {/* Video Section */}
        <div className="aspect-video relative">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/CD%201.mp4"
            muted
            playsInline
            autoPlay
          />

          {/* Audio Player (Hidden) */}
          <audio
            ref={audioRef}
            src="\Bg music.mp3" // ✅ Add your audio file to public directory
            preload="auto"
          />

          {/* Play/Pause Button */}
          <div className="absolute bottom-4 left-4 z-10">
            <Button
              onClick={handlePlayPause}
              size="icon"
              className="rounded-full w-12 h-12 bg-white/20 text-white backdrop-blur"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Footer with Text + Skip */}
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {gender === 'male' || gender === 'female' ? 'Your' : 'Your'} Birthday Celebration
          </h2>
          <Button
            onClick={handleSkip}
            className="bg-white text-black dark:bg-black dark:text-white border border-gray-300 dark:border-gray-600 hover:opacity-90 transition"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip Intro
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default IntroVideo;
