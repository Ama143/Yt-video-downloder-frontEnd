function checkYouTubeCookies() {
    // Check for common YouTube authentication cookies
    const cookies = document.cookie;
    return cookies.includes('SAPISID') || 
           cookies.includes('SID') || 
           cookies.includes('SSID') || 
           cookies.includes('APISID');
}

document.getElementById('download-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('status');

    // Check for YouTube cookies locally
    if (!checkYouTubeCookies()) {
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

    const videoUrl = document.getElementById('videoUrl').value;
    const format = document.getElementById('format').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    status.textContent = "Processing...";

    try {
        const response = await fetch('https://yt-video-downloader-backendppy.onrender.com/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ 
                videoUrl,
                format,
                startTime: startTime || null,
                endTime: endTime || null,
                recaptchaToken
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
        console.error('Download error:', error);
        status.textContent = `Error: ${error.message}`;
        grecaptcha.reset();  // Reset reCAPTCHA on error
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
