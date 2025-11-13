import React, { useState, useCallback, useMemo } from 'react';
import { Dropzone } from './components/Dropzone';
import { GitHubIcon } from './components/icons/GitHubIcon';
import { CheckCircleIcon } from './components/icons/CheckCircleIcon';
import { XCircleIcon } from './components/icons/XCircleIcon';
import { GitLaunchIcon } from './components/icons/GitLaunchIcon';
import { CreditModal } from './components/CreditModal';
import { useCreditSystem } from './hooks/useCreditSystem';
import { uploadToGithub } from './services/githubService';
import { UploadStatus } from './types';
import { StorePage } from './components/StorePage';
import { CreditCoinIcon } from './components/icons/CreditCoinIcon';

declare const JSZip: any;

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [repoName, setRepoName] = useState<string>('');
  const [githubToken, setGithubToken] = useState<string>('');
  const [status, setStatus] = useState<UploadStatus>(UploadStatus.IDLE);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'uploader' | 'store'>('uploader');

  const { uploadsLeft, isOutOfCredits, decrementUploads } = useCreditSystem();

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles);
  }, []);

  const resetState = () => {
    setFiles([]);
    setRepoName('');
    // Do not reset githubToken to make it easier for subsequent uploads
    setStatus(UploadStatus.IDLE);
    setStatusMessage('');
    setRepoUrl('');
    setErrorMessage('');
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isOutOfCredits) {
      setIsCreditModalOpen(true);
      return;
    }

    if (files.length === 0 || !repoName || !githubToken) {
      setErrorMessage('Please provide a repository name, a token, and select files to upload.');
      setStatus(UploadStatus.ERROR);
      return;
    }

    setStatus(UploadStatus.UPLOADING);
    setUploadProgress(0);
    setErrorMessage('');

    try {
      let filesToUpload = files;
      const isZipUpload = files.length === 1 && files[0].name.toLowerCase().endsWith('.zip');

      if (isZipUpload) {
        setStatusMessage('Unzipping project file...');
        const zipFile = files[0];
        const jszip = new JSZip();
        const zip = await jszip.loadAsync(zipFile);
        
        const extractedFiles: File[] = [];
        const filePromises: Promise<void>[] = [];

        zip.forEach((relativePath: string, zipEntry: any) => {
          if (!zipEntry.dir) {
            const promise = zipEntry.async('blob').then((blob: Blob) => {
              extractedFiles.push(new File([blob], relativePath, { type: blob.type }));
            });
            filePromises.push(promise);
          }
        });

        await Promise.all(filePromises);
        filesToUpload = extractedFiles;
      }

      if (filesToUpload.length === 0) {
        throw new Error("No files found to upload. The zip archive might be empty or contain only folders.");
      }

      const hasReadme = filesToUpload.some(file => {
          const path = (file as any).webkitRelativePath || file.name;
          const pathParts = path.split('/');
          return pathParts[pathParts.length - 1].toLowerCase() === 'readme.md';
      });

      if (!hasReadme) {
          const readmeContent = `# ${repoName}\n\nThis repository was created with GitLaunch.`;
          const readmeFile = new File([readmeContent], 'README.md', { type: 'text/markdown' });
          filesToUpload = [...filesToUpload, readmeFile];
      }
      
      const result = await uploadToGithub(
        repoName,
        filesToUpload,
        githubToken,
        (message, progress) => {
          setStatusMessage(message);
          setUploadProgress(progress);
        }
      );
      setRepoUrl(result.repoUrl);
      setStatus(UploadStatus.SUCCESS);
      decrementUploads(); // Decrement after a successful upload
    } catch (error: any) {
      setErrorMessage(error.message || 'An unknown error occurred.');
      setStatus(UploadStatus.ERROR);
    }
  };

  const isFormValid = useMemo(() => {
    return files.length > 0 && repoName.trim() !== '' && githubToken.trim() !== '';
  }, [files, repoName, githubToken]);

  const renderUploaderContent = () => {
    switch (status) {
      case UploadStatus.UPLOADING:
        return (
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className="w-full bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xl font-semibold">Deploying to GitHub...</p>
            <p className="mt-2 text-slate-400 h-5">{statusMessage}</p>
          </div>
        );
      case UploadStatus.SUCCESS:
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <CheckCircleIcon className="w-20 h-20 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold">Deployment Successful!</h2>
            <p className="mt-2 text-slate-300">Your project is now live on GitHub.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <GitHubIcon className="w-5 h-5" />
                View Repository
              </a>
              <button
                onClick={resetState}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Deploy Another Project
              </button>
            </div>
          </div>
        );
      case UploadStatus.ERROR:
        return (
          <div className="flex flex-col items-center justify-center text-center">
            <XCircleIcon className="w-20 h-20 text-red-500" />
            <h2 className="mt-4 text-2xl font-bold">Deployment Failed</h2>
            <p className="mt-2 text-slate-300 bg-red-900/50 px-4 py-2 rounded-md">{errorMessage}</p>
            <button
              onClick={resetState}
              className="mt-6 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      case UploadStatus.IDLE:
      default:
        return (
          <form onSubmit={handleSubmit} className="w-full">
            <Dropzone onFilesSelected={handleFilesSelected} initialFiles={files} />
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="repoName" className="block text-sm font-medium text-slate-300">
                  Repository Name
                </label>
                <input
                  type="text"
                  name="repoName"
                  id="repoName"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-600 bg-slate-800 py-3 px-4 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="my-awesome-project"
                />
              </div>
              <div>
                 <label htmlFor="githubToken" className="block text-sm font-medium text-slate-300">
                  GitHub Personal Access Token
                </label>
                <input
                  type="password"
                  name="githubToken"
                  id="githubToken"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-600 bg-slate-800 py-3 px-4 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="ghp_..."
                  autoComplete="current-password"
                />
                 <p className="mt-2 text-xs text-slate-400">
                  A <strong>Classic Personal Access Token</strong> with full <code className="bg-slate-700 px-1 py-0.5 rounded">repo</code> scope is required to create new repositories.{' '}
                  <a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    Create a classic token here.
                  </a>
                </p>
                <div className="mt-2 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-xs text-yellow-300">
                  <strong>Security Warning:</strong> Your token is used directly from the browser and is not stored. Be aware of the risks of pasting sensitive tokens into web applications.
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={!isFormValid}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              <GitHubIcon className="w-6 h-6" />
              Deploy to GitHub
            </button>
          </form>
        );
    }
  };

  const renderContent = () => {
    if (currentView === 'store') {
        return <StorePage onBack={() => setCurrentView('uploader')} />;
    }

    return (
        <>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 sm:p-10 shadow-2xl shadow-slate-950/50">
                <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 p-3 rounded-full border border-slate-700">
                            <GitLaunchIcon className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold">GitLaunch</h1>
                            <p className="text-slate-400 mt-1">Deploy projects to GitHub instantly.</p>
                        </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                         <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-center">
                            <div className="text-sm font-medium text-slate-400">Uploads Left</div>
                            <div className="text-2xl font-bold text-white">{uploadsLeft > 0 ? uploadsLeft : '0'}</div>
                        </div>
                        <button 
                            onClick={() => setCurrentView('store')}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                            <CreditCoinIcon className="w-4 h-4" />
                            Buy Credits
                        </button>
                    </div>
                </div>
                <div className="min-h-[300px] flex items-center justify-center">
                    {renderUploaderContent()}
                </div>
            </div>
            <footer className="text-center mt-8 text-slate-500 text-sm">
                <p>Built with React, TypeScript, and Tailwind CSS.</p>
            </footer>
        </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <main className={`w-full mx-auto transition-all duration-500 ${currentView === 'store' ? 'max-w-5xl' : 'max-w-2xl'}`}>
        <div key={currentView} className="animate-fadeIn">
         {renderContent()}
        </div>
      </main>
      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        onGoToStore={() => {
            setIsCreditModalOpen(false);
            setCurrentView('store');
        }}
       />
    </div>
  );
};

export default App;