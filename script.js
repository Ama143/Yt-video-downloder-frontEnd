document.getElementById('download-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const videoUrl = document.getElementById('videoUrl').value;
    const format = document.getElementById('format').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const status = document.getElementById('status');

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
        console.error('Download error:', error);
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
