import React, { useState } from 'react';
import { Wand2, Download, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { generateOrEditImage } from './services/geminiService';
import { ImageUpload } from './components/ImageUpload';
import { Button } from './components/Button';
import { ImageFile, AppState } from './types';

// Default prompt suggested by user
const DEFAULT_PROMPT = "Generate an anti-fouling coating for application on marine optical equipment, with a realistic picture style";

export default function App() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setAppState(AppState.LOADING);
    setErrorMsg(null);
    setResultImage(null);
    setResultText(null);

    try {
      const result = await generateOrEditImage(prompt, sourceImage);
      
      if (result.imageUrl) {
        setResultImage(result.imageUrl);
      }
      if (result.text) {
        setResultText(result.text);
      }
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `gemini-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl w-full mb-10 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-zinc-900 rounded-2xl ring-1 ring-zinc-800 shadow-lg mb-4">
          <div className="h-10 w-10 bg-gradient-to-br from-banana-400 to-banana-600 rounded-xl flex items-center justify-center mr-3 shadow-inner">
             <Sparkles className="text-black w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Nano Banana Editor
          </h1>
        </div>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Powered by Gemini 2.5 Flash Image. Upload an image to edit it, or type a prompt to generate something new.
        </p>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Controls */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="text-banana-400 w-5 h-5" />
              1. Source Image
            </h2>
            <ImageUpload 
              image={sourceImage} 
              onImageChange={setSourceImage} 
            />
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Wand2 className="text-banana-400 w-5 h-5" />
              2. Describe your edit
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-zinc-400 mb-2">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  rows={4}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 focus:ring-2 focus:ring-banana-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="E.g., Add a retro filter, remove the background, or generate a futuristic city..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-3 text-red-200 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full py-3 text-lg font-semibold shadow-lg shadow-banana-500/20"
                isLoading={appState === AppState.LOADING}
                disabled={!prompt.trim()}
              >
                {sourceImage ? 'Edit Image' : 'Generate Image'}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:sticky lg:top-8 space-y-6">
           <div className={`
             relative rounded-2xl overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center
             border-2 transition-all duration-300
             ${resultImage ? 'border-banana-500/50 bg-zinc-900' : 'border-zinc-800 border-dashed bg-zinc-900/30'}
           `}>
              {appState === AppState.LOADING && (
                <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-banana-200 border-t-banana-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-banana-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-4 text-banana-200 font-medium animate-pulse">
                    Gemini is thinking...
                  </p>
                </div>
              )}

              {resultImage ? (
                <>
                  <img 
                    src={resultImage} 
                    alt="Generated Result" 
                    className="w-full h-full object-contain max-h-[700px] bg-checkerboard"
                  />
                  <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 bg-banana-500 text-black text-xs font-bold rounded-full shadow-lg">
                       GENERATED
                     </span>
                  </div>
                  <div className="absolute bottom-6 right-6 flex gap-3 z-10">
                     <Button 
                      onClick={handleDownload} 
                      variant="secondary"
                      className="shadow-xl bg-black/50 backdrop-blur-md hover:bg-black/70 border border-white/10"
                    >
                      <Download className="w-4 h-4" /> Download
                    </Button>
                  </div>
                </>
              ) : (
                 <div className="p-8 max-w-sm">
                   <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-600">
                     <Sparkles className="w-10 h-10" />
                   </div>
                   <h3 className="text-xl font-medium text-zinc-300 mb-2">Ready to Create</h3>
                   <p className="text-zinc-500">
                     Your generated or edited image will appear here. Try uploading an image to start editing!
                   </p>
                 </div>
              )}
           </div>

           {resultText && (
             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
               <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Model Note</h3>
               <p className="text-zinc-200 leading-relaxed">{resultText}</p>
             </div>
           )}
        </div>

      </div>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-banana-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}