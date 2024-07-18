document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('urlInput');
    const urlResult = document.getElementById('urlResult');
    const file_extension_list = new Set([".html", ".jpg", ".png", ".txt"]);
    let typingStatus = document.getElementById('typingStatus');

    let timeout = null;
    const throttleInterval = 2000; // 2s client request to server delay

    /* Event listener for input event on URL input field */
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
                await interpretateUrl(url);
            } else {
                urlResult.textContent = 'Invalid URL format';
            }
            
            typingStatus.textContent = 'Result'; typingStatus.style.fontStyle = 'normal'; typingStatus.style.fontWeight = 'bold';
        }, throttleInterval); 
    });

    /* Asynchronous server call to provide information if it exits and if it a file or a folder */
    async function interpretateUrl(url) {
        const url_check = await checkTypeUrl(url);
        urlResult.innerHTML = `<p>URL exists: ${url_check.exit}</p><p>Type: ${url_check.type}</p>`;
    }

    async function checkTypeUrl(url) {
        let exit = true;
        let type = 'not file nor folder';
        
        // check if URL exists
        try {
            const response = await fetch(url, { method: 'HEAD' });
        } catch (no_response) {
            exit = false;
            return {exit, type};
        }

        // check if URL is file or folder
        if (url.endsWith('/')){ 
            type = 'folder';
        } else {
            for (const ext of file_extension_list) {
                if (url.endsWith(ext)) {
                    type = 'file';
                }
            }
        }
        return {exit, type};
    }
});
