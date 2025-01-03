document.getElementById('download-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('status');
    status.textContent = "Checking YouTube authentication...";

    try {
        // Check auth status first
        const authResponse = await fetch('https://yt-video-downloader-backendppy.onrender.com/check-auth', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
            }
        });

        const authData = await authResponse.json();
        if (!authData.authenticated) {
            status.innerHTML = `
                <div class="error-message">
                    Please sign in to YouTube first! 
                    <a href="https://accounts.google.com/signin/v2/identifier?service=youtube" 
                       target="_blank">Sign in to YouTube</a>
                    in a new tab, then come back and try again.
                    <br><br>
                    <small>Tip: After signing in, refresh this page before trying again.</small>
                </div>
            `;
            return;
        }

        status.textContent = "Processing download...";
        const videoUrl = document.getElementById('videoUrl').value;
        const format = document.getElementById('format').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;

        const response = await fetch('https://yt-video-downloader-backendppy.onrender.com/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
                videoUrl,
                format,
                startTime: startTime || null,
                endTime: endTime || null
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.downloadUrl) {
            status.innerHTML = `<a href="${data.downloadUrl}" class="download-link">Download your file</a>`;
        } else {
            status.textContent = "Download failed: No download URL received";
        }
    } catch (error) {
        console.error('Error:', error);
        status.textContent = `Error: ${error.message}`;
    }
});

document.getElementById('transcript-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('transcript-url').value;
    const status = document.getElementById('transcript-status');

    status.textContent = "Fetching transcript...";

    try {
        const response = await fetch('https://yt-video-downloader-backendppy.onrender.com/transcript', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        status.innerHTML = `Transcript available: <a href="${data.transcript_url}" target="_blank">Download Transcript</a>`;
    } catch (error) {
        console.error('Transcript error:', error);
        status.textContent = `Error: ${error.message}`;
    }
});
