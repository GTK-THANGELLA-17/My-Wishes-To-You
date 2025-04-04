import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Cake, Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ColorTheme, Gender } from '@/pages/Index';
import DateInput from './DateInput';

interface BirthdayInputProps {
  onCelebrate: (name: string, dob: Date, gender?: Gender, photoUrl?: string) => void;
  colorTheme: ColorTheme;
  isDarkMode: boolean;
}

export default function BirthdayInput({ onCelebrate, colorTheme, isDarkMode }: BirthdayInputProps) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState<Date>(new Date());
  const [gender, setGender] = useState<Gender>(undefined);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter a name to continue",
        variant: "destructive",
      });
      return;
    }

    onCelebrate(name, dob, gender, photoPreview || undefined);
  };

  const handleDateChange = (newDate: Date) => {
    setDob(newDate);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access or upload a photo instead",
        variant: "destructive",
      });
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPhotoPreview(canvas.toDataURL('image/png'));

        const stream = video.srcObject as MediaStream;
        if (stream) stream.getTracks().forEach(track => track.stop());

        setShowCamera(false);
      }
    }
  };

  const MeteorEffect = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: isDarkMode ? `0 0 10px 2px rgba(255,255,255,0.3)` : `0 0 10px 2px rgba(0,0,0,0.2)`,
          }}
          animate={{
            top: ['0%', '100%'],
            left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [1, 0],
            width: ['1px', '3px'],
            height: ['1px', '300px'],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );

  const generateGradientByTheme = () => {
    if (isDarkMode) {
      switch (colorTheme) {
        case 'pink': return 'from-pink-800/50 to-purple-900/50';
        case 'purple': return 'from-purple-800/50 to-indigo-900/50';
        case 'green': return 'from-green-800/50 to-teal-900/50';
        case 'orange': return 'from-orange-800/50 to-amber-900/50';
        case 'blue': default: return 'from-blue-800/50 to-indigo-900/50';
      }
    } else {
      switch (colorTheme) {
        case 'pink': return 'from-pink-100 to-pink-50';
        case 'purple': return 'from-purple-100 to-purple-50';
        case 'green': return 'from-green-100 to-green-50';
        case 'orange': return 'from-orange-100 to-orange-50';
        case 'blue': default: return 'from-blue-100 to-blue-50';
      }
    }
  };

  const buttonColorByTheme = () => {
    switch (colorTheme) {
      case 'pink': return 'bg-pink-600 hover:bg-pink-700';
      case 'purple': return 'bg-purple-600 hover:bg-purple-700';
      case 'green': return 'bg-green-600 hover:bg-green-700';
      case 'orange': return 'bg-orange-600 hover:bg-orange-700';
      case 'blue': default: return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="p-4 w-full max-w-3xl mx-auto">
      <MeteorEffect />

      <Card className={`overflow-hidden relative ${isDarkMode ? 'bg-gray-900 border-gray-800 text-white' : ''}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${generateGradientByTheme()} opacity-70 -z-10`}></div>

        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <Cake className={`h-6 w-6 ${
              colorTheme === 'pink' ? 'text-pink-500' :
              colorTheme === 'purple' ? 'text-purple-500' :
              colorTheme === 'green' ? 'text-green-500' :
              colorTheme === 'orange' ? 'text-orange-500' :
              'text-blue-500'}`} />
            <CardTitle className="text-2xl">Enter Your Details</CardTitle>
          </div>
          <CardDescription className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>
            Provide your information to create a personalized birthday celebration
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Your Name</Label>
              <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required className={isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''} />
            </div>

            <DateInput value={dob} onChange={handleDateChange} isDarkMode={isDarkMode} />

            <div className="space-y-4">
              <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Gender (Optional)</Label>
              <Select value={gender || 'not-specified'} onValueChange={(value) => setGender(value === 'not-specified' ? undefined : value as Gender)}>
                <SelectTrigger className={isDarkMode ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="not-specified">Not specified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Photo (Optional)</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`flex-1 flex items-center justify-center border-2 border-dashed rounded-md h-40 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${photoPreview ? 'p-2' : 'p-4'}`}>
                  {photoPreview ? (
                    <div className="relative w-full h-full">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-contain rounded-md" />
                      <Button type="button" variant="outline" size="sm" className="absolute top-2 right-2" onClick={() => { setPhoto(null); setPhotoPreview(null); }}>Remove</Button>
                    </div>
                  ) : (
                    <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Upload className="mx-auto h-8 w-8 mb-2" />
                      <div className="text-sm mb-2">Your photo will be displayed on the birthday wishes and celebration screens.</div>
                      <p className="text-sm">Upload or take a photo</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                    <Upload className="mr-2 h-4 w-4" />Upload
                  </Button>
                  <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  <Button type="button" variant="outline" onClick={startCamera}>
                    <Camera className="mr-2 h-4 w-4" />Take Photo
                  </Button>
                </div>
              </div>

              {showCamera && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                  <div className={`bg-${isDarkMode ? 'gray-900' : 'white'} p-4 rounded-lg max-w-md w-full`}>
                    <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : ''}`}>Take a Photo</h3>
                    <div className="relative aspect-video bg-black rounded-md overflow-hidden mb-4">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                    </div>
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => {
                        if (videoRef.current?.srcObject) {
                          const stream = videoRef.current.srcObject as MediaStream;
                          stream.getTracks().forEach(track => track.stop());
                        }
                        setShowCamera(false);
                      }}>Cancel</Button>
                      <Button type="button" onClick={takePhoto}>Capture</Button>
                    </div>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                  </div>
                </div>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="button" onClick={handleSubmit} className={`relative ${buttonColorByTheme()} text-white`}>
            Start Celebration
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}