document.getElementById('download-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const status = document.getElementById('status');

    status.textContent = "Processing...";

    try {
        const response = await fetch('https://yt-video-downloader-backend.onrender.com/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, start, end }),
        });

        const data = await response.json();

        if (response.ok) {
            status.textContent = `Download Success: ${data.message}`;
        } else {
            status.textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        status.textContent = `Request Failed: ${error.message}`;
    }
});
document.getElementById('transcript-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('transcript-url').value;
    const status = document.getElementById('transcript-status');

    status.textContent = "Fetching transcript...";

    try {
        const response = await fetch('https://yt-video-downloader-backend.onrender.com/transcript', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (response.ok) {
            status.innerHTML = `Transcript available: <a href="${data.transcript_url}" target="_blank">Download Transcript</a>`;
        } else {
            status.textContent = `Error: ${data.error}`;
        }
    } catch (error) {
        status.textContent = `Request Failed: ${error.message}`;
    }
});
