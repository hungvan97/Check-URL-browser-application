document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('urlInput');
    const urlResult = document.getElementById('urlResult');
    const file_extension_list = new Set([".html", ".jpg", ".png", ".txt"]);
    let typingStatus = document.getElementById('typingStatus');

    let timeout = null;
    const throttleInterval = 2000; // 2s client request to server delay

    urlInput.addEventListener('input', function() {
        // Show typing status
        typingStatus.textContent = 'Typing...'; typingStatus.style.fontStyle = 'italic';

        // Clear result
        urlResult.textContent = '';

        // Check validity of URL with delay and asynchronous call server to check existence of URL 
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            const url = urlInput.value;
            const pattern = /^(?:(?:https?|s?ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i;
            if (!!pattern.test(url)) {
                await checkUrlExistence(url);
            } else {
                urlResult.textContent = 'Invalid URL format';
            }
            
            typingStatus.textContent = 'Result'; typingStatus.style.fontStyle = 'normal'; typingStatus.style.fontWeight = 'bold';
        }, throttleInterval); 
    });

    async function checkUrlExistence(url) {
        // Mocking server response with a delay
        const url_interpretation = await checkUrl(url);
        urlResult.innerHTML = `<p>URL exists: True</p><p>Type: ${url_interpretation.type}</p>`;
    }

    async function checkUrl(url) {
        // Simple mock server logic for demonstration purposes
        if (url.endsWith('/')){ 
            return { exists: true, type: 'folder' };
        } else {
            for (const ext of file_extension_list) {
                if (url.endsWith(ext)) {
                    return { exists: true, type: 'file' };
                }
            }
        }
        return { exists: false, type: 'not file nor folder' };
    }
});

// implementation server hangs up after 3s
// creat JSON list of file_extension_list
