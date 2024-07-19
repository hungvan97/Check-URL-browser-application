import file_extension from './public/file_extensions.json' with {type: 'json'};
import { interpretateUrl } from './script/interpretateUrl.js';
import { checkUrlValid } from './script/checkUrlValid.js';
document.addEventListener('DOMContentLoaded', function () {
    const urlInput = document.getElementById('urlInput');
    const urlResult = document.getElementById('urlResult');
    const file_extension_list = file_extension.file_extension_list;
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
            const isUrlValid = checkUrlValid(url);
            if (isUrlValid) {
                await callServer(url);
            } else {
                urlResult.textContent = 'Invalid URL format';
            }
            
            typingStatus.style.fontWeight = 'bold'; typingStatus.style.fontStyle = 'normal'; 
            typingStatus.textContent = 'Result'; 
        }, throttleInterval); 
    });

    /* Asynchronous server call to provide information if it exits and if it a file or a folder */
    async function callServer(url) {
        const url_check = await interpretateUrl(url, file_extension_list);
        urlResult.innerHTML = `<p>URL exists: ${url_check.exist}</p><p>Type: ${url_check.type}</p>`;
    }
});