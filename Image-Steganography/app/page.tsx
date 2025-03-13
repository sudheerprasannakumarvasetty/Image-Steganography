'use client';

import { useState, useRef } from 'react';
import { Upload, Download, FileImage, Save, Trash2, Lock, Unlock, Image } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setOriginalFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearInputs = () => {
    setImage(null);
    setMessage('');
    setDecodedMessage('');
    setOriginalFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadImage = () => {
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = image;
    const fileName = originalFileName
      ? `encoded-${originalFileName}`
      : 'encoded-image.png';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadMessage = () => {
    if (!decodedMessage) return;
    
    const blob = new Blob([decodedMessage], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'revealed-message.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const hideMessage = async () => {
    if (!image || !message) return;
    setLoading(true);

    try {
      const img = new window.Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      const binary = message
        .split('')
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');

      const binaryLength = binary.length.toString(2).padStart(32, '0');
      const fullBinary = binaryLength + binary;

      for (let i = 0; i < fullBinary.length; i++) {
        pixels[i * 4] = (pixels[i * 4] & 254) | parseInt(fullBinary[i]);
      }

      ctx.putImageData(imageData, 0, 0);
      const stegoImage = canvas.toDataURL();
      setImage(stegoImage);
    } catch (error) {
      console.error('Error hiding message:', error);
    } finally {
      setLoading(false);
    }
  };

  const revealMessage = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const img = new window.Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let binaryLength = '';
      for (let i = 0; i < 32; i++) {
        binaryLength += pixels[i * 4] & 1;
      }
      const messageLength = parseInt(binaryLength, 2);

      let binary = '';
      for (let i = 32; i < 32 + messageLength; i++) {
        binary += pixels[i * 4] & 1;
      }

      const message = binary
        .match(/.{8}/g)!
        .map((byte) => String.fromCharCode(parseInt(byte, 2)))
        .join('');

      setDecodedMessage(message);
    } catch (error) {
      console.error('Error revealing message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Image Steganography
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Hide secret messages within images using advanced steganography techniques. 
            Your data remains private and secure.
          </p>
        </div>
        
        <Tabs defaultValue="encode" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-900 p-1 rounded-lg">
            <TabsTrigger value="encode" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Lock className="w-4 h-4 mr-2" />
              Hide Message
            </TabsTrigger>
            <TabsTrigger value="decode" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Unlock className="w-4 h-4 mr-2" />
              Reveal Message
            </TabsTrigger>
          </TabsList>

          <TabsContent value="encode">
            <Card className="p-8 bg-zinc-900 border-zinc-800 shadow-xl">
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearInputs}
                    className="text-red-500 hover:text-red-400 hover:bg-red-950/30 border-red-900"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="image-upload" className="text-lg font-medium text-white">Upload Image</Label>
                  <div
                    className={`relative cursor-pointer min-h-[200px] flex items-center justify-center ${
                      isDragging ? 'border-red-500 bg-red-500/5' : 'border-zinc-700 bg-zinc-800/30'
                    } border-2 border-dashed rounded-lg transition-all duration-200 hover:border-red-500 hover:bg-red-500/5`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                  >
                    <input
                      ref={fileInputRef}
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="p-8 text-center">
                      <Image className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-red-500' : 'text-zinc-500'}`} />
                      <p className={`text-lg ${isDragging ? 'text-red-500' : 'text-zinc-500'}`}>
                        {isDragging ? 'Drop your image here' : 'Click or drag and drop an image here'}
                      </p>
                      {image && (
                        <p className="mt-2 text-sm text-zinc-400">
                          Selected: {originalFileName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="text-lg font-medium text-white">Secret Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your secret message..."
                    className="min-h-[120px] resize-none bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={hideMessage}
                    disabled={!image || !message || loading}
                    className="w-full bg-red-600 text-white hover:bg-red-700 h-12 text-lg font-medium disabled:bg-zinc-800"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    Hide Message
                  </Button>
                  
                  {image && (
                    <Button
                      onClick={downloadImage}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-red-600 h-12 text-lg font-medium"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Image
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="decode">
            <Card className="p-8 bg-zinc-900 border-zinc-800 shadow-xl">
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearInputs}
                    className="text-red-500 hover:text-red-400 hover:bg-red-950/30 border-red-900"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="stego-image" className="text-lg font-medium text-white">Upload Encoded Image</Label>
                  <div
                    className={`relative cursor-pointer min-h-[200px] flex items-center justify-center ${
                      isDragging ? 'border-red-500 bg-red-500/5' : 'border-zinc-700 bg-zinc-800/30'
                    } border-2 border-dashed rounded-lg transition-all duration-200 hover:border-red-500 hover:bg-red-500/5`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                  >
                    <input
                      ref={fileInputRef}
                      id="stego-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="p-8 text-center">
                      <Image className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-red-500' : 'text-zinc-500'}`} />
                      <p className={`text-lg ${isDragging ? 'text-red-500' : 'text-zinc-500'}`}>
                        {isDragging ? 'Drop your encoded image here' : 'Click or drag and drop an encoded image here'}
                      </p>
                      {image && (
                        <p className="mt-2 text-sm text-zinc-400">
                          Selected: {originalFileName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={revealMessage}
                  disabled={!image || loading}
                  className="w-full bg-red-600 text-white hover:bg-red-700 h-12 text-lg font-medium disabled:bg-zinc-800"
                >
                  <Unlock className="w-5 h-5 mr-2" />
                  Reveal Message
                </Button>

                {decodedMessage && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-lg font-medium text-white">Revealed Message</Label>
                      <Card className="p-6 bg-zinc-800/50 border-zinc-700">
                        <p className="whitespace-pre-wrap text-white">{decodedMessage}</p>
                      </Card>
                    </div>
                    
                    <Button
                      onClick={downloadMessage}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-red-600 h-12 text-lg font-medium"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Message as Text File
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {image && (
          <div className="mt-8">
            <Label className="text-lg font-medium text-white">Preview</Label>
            <Card className="p-4 mt-2 bg-zinc-900 border-zinc-800 shadow-xl">
              <img
                src={image}
                alt="Preview"
                className="max-w-full h-auto rounded-lg mx-auto"
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}