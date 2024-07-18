import file_extension from './public/file_extensions.json' with {type: 'json'};
document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('urlInput');
    const urlResult = document.getElementById('urlResult');
    const file_extension_list = file_extension.file_extension_list;
    // const file_extension = new Set([
    //     ".html",
    //     ".css",
    //     ".js",
    //     ".xml",
    //     ".png",
    //     ".jpg",
    //     ".gif",
    //     ".xap",
    //     ".xslt",
    //     ".ico",
    //     ".svg",
    //     ".resx"
    // ]);
    let typingStatus = document.getElementById('typingStatus');

    let timeout = null;
    const throttleInterval = 1000; // 1s client request to server delay

    /* Event listener for input event on URL input field */
    urlInput.addEventListener('input', function() {
        // Show typing status
        typingStatus.style.fontWeight = 'normal'; typingStatus.style.fontStyle = 'italic';
        typingStatus.textContent = 'Typing...'; 

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
            
            typingStatus.style.fontWeight = 'bold'; typingStatus.style.fontStyle = 'normal'; 
            typingStatus.textContent = 'Result'; 
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
            let response = await fetch(url, { method: 'HEAD' });
            if(response.status !== 200) {
                exit = false;
                return {exit, type};
            }
        } catch (e) {
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