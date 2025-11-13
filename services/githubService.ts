const GITHUB_API_URL = 'https://api.github.com';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Result is a Data URL: "data:;base64,ENCODED_STRING"
      // We only need the ENCODED_STRING part
      const result = reader.result as string;
      const base64Content = result.split(',')[1];
      if (base64Content) {
        resolve(base64Content);
      } else {
        reject(new Error(`Failed to read file as Base64: ${file.name}`));
      }
    };
    reader.onerror = error => reject(error);
  });
};

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `API request failed with status ${response.status}` }));
    const errorMessage = errorData.message || `API request failed with status ${response.status}`;
    const errors = errorData.errors ? ` Errors: ${JSON.stringify(errorData.errors)}` : '';
    throw new Error(`${errorMessage}.${errors}`);
  }
  return response.json();
};

export const uploadToGithub = async (
  repoName: string,
  files: File[],
  token: string,
  onProgress: (message: string, progress: number) => void
): Promise<{ repoUrl: string }> => {
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
  };

  // Step 1: Get authenticated user's username to ensure correctness
  onProgress('Authenticating with GitHub...', 5);
  const userResponse = await fetch(`${GITHUB_API_URL}/user`, { headers }).then(handleApiResponse);
  const username = userResponse.login;

  if (!username) {
    throw new Error('Could not retrieve GitHub username from the provided token. Please check if the token is valid and has the correct permissions.');
  }

  // Step 2: Create the repository
  onProgress(`Creating new repository: ${username}/${repoName}`, 10);
  
  await fetch(`${GITHUB_API_URL}/user/repos`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: repoName,
      description: 'Repository created via GitLaunch',
      private: false,
    }),
  }).then(handleApiResponse).catch(error => {
    if (error.message.includes("name already exists")) {
      throw new Error(`Repository "${username}/${repoName}" already exists. Please choose a different name.`);
    }
    if (error.message.includes("Resource not accessible")) {
        throw new Error('Repository creation failed due to token permissions. Please use a "Classic" GitHub token with the full "repo" scope. Fine-grained tokens may not have the necessary permissions to create new repositories.');
    }
    throw error;
  });

  // Step 3: Upload each file to the repository
  const totalFiles = files.length;
  for (let i = 0; i < totalFiles; i++) {
    const file = files[i];
    // webkitRelativePath is used for folder uploads, otherwise use name
    const path = (file as any).webkitRelativePath || file.name;
    
    // Progress for upload stage goes from 10% to 95%
    const progress = 10 + Math.round(((i + 1) / totalFiles) * 85);
    onProgress(`Uploading file ${i + 1} of ${totalFiles}: ${path}`, progress);

    const content = await fileToBase64(file);
    
    await fetch(`${GITHUB_API_URL}/repos/${username}/${repoName}/contents/${path}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `feat: Add ${path}`,
        content: content,
      }),
    }).then(handleApiResponse);
  }

  onProgress('Finalizing deployment...', 100);
  
  return {
    repoUrl: `https://github.com/${username}/${repoName}`
  };
};
