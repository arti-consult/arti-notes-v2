import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
}

export default function AudioVisualizer({ stream }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    
    if (!stream || !canvasRef.current) return;

    const initializeAudio = async () => {
      try {
        // Create new AudioContext only if needed and not already closed
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          audioContextRef.current = new AudioContext();
        }
        const audioContext = audioContextRef.current;

        // If context is suspended, resume it
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        // Create and store source node
        sourceRef.current = audioContext.createMediaStreamSource(stream);
        const analyzer = audioContext.createAnalyser();
        analyzerRef.current = analyzer;
        
        // Optimize analyzer settings
        analyzer.fftSize = 256; // Reduced for better performance
        analyzer.smoothingTimeConstant = 0.6;
        analyzer.minDecibels = -90;
        analyzer.maxDecibels = -10;
        
        sourceRef.current.connect(analyzer);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Optimize drawing function
        const draw = () => {
          if (!canvas || !ctx || !analyzer || !isMounted.current) return;
          
          animationRef.current = requestAnimationFrame(draw);

          // Clear previous frame
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Get frequency data
          analyzer.getByteFrequencyData(dataArray);

          const barWidth = 2;
          const gap = 1;
          const totalWidth = barWidth + gap;
          const halfWidth = canvas.width / 2;
          const barCount = Math.floor(halfWidth / totalWidth);

          // Draw visualization
          for (let i = 0; i < barCount; i++) {
            // Calculate average frequency for this bar
            let sum = 0;
            const samplesPerBar = Math.floor(bufferLength / barCount);
            const startIndex = i * samplesPerBar;
            
            for (let j = 0; j < samplesPerBar; j++) {
              sum += dataArray[startIndex + j];
            }
            
            let value = sum / samplesPerBar;

            // Apply noise gate
            const noiseThreshold = 15;
            if (value < noiseThreshold) {
              value = 0;
            } else {
              value = ((value - noiseThreshold) / (255 - noiseThreshold)) * 255;
            }

            // Apply frequency-based boost
            const positionBoost = 1 + (i / barCount) * 0.3;
            value = Math.min(255, value * positionBoost * 0.8);

            const percent = value / 255;
            const height = Math.max((canvas.height * percent) * 0.9, 2);

            // Calculate alpha based on amplitude
            const alpha = 0.3 + (percent * 0.7);
            ctx.fillStyle = `rgba(124, 58, 237, ${alpha})`;

            // Draw right bar with rounded corners
            const x = halfWidth + (i * totalWidth);
            const y = (canvas.height - height) / 2;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, height, barWidth / 2);
            ctx.fill();

            // Draw mirrored left bar
            const mirrorX = halfWidth - ((i + 1) * totalWidth);
            ctx.beginPath();
            ctx.roundRect(mirrorX, y, barWidth, height, barWidth / 2);
            ctx.fill();
          }
        };

        // Start animation
        draw();

        // Cleanup function
        return () => {        
          isMounted.current = false;
          
          // Cancel animation frame
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = undefined;
          }

          // Disconnect nodes
          if (analyzerRef.current) {
            analyzerRef.current.disconnect();
            analyzerRef.current = null;
          }

          if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
          }

          // Suspend AudioContext instead of closing
          if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.suspend().catch(console.warn);
          }
        };
      } catch (error) {
        console.error('Error initializing audio visualizer:', error);
      }
    };

    initializeAudio();
  }, [stream]);

  return (
    <canvas 
      ref={canvasRef} 
      width={500} 
      height={60} 
      className="w-full h-20 rounded-lg bg-gray-50"
    />
  );
}