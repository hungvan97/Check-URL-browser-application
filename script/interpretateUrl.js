/* This script implement URL logic check  */ 
async function interpretateUrl(url, file_extension_list) {
    let exist = null;
    let type = 'not file nor folder';
    
    // check if URL exists
    try {
        let response = await fetch(url, { method: 'HEAD' , redirect: 'manual'});
        if (response.status === 200) {
            exist = true;
        }
        if (response.status === 404) {
            exist = 'false';
        }
    } catch (e) {
      // pass handle error
      exist = false; 
      type = "unknown";
      return {exist, type};
    }

    // check if URL is file or folder in case URL exists
    if (url.endsWith('/')){ 
        type = 'folder';
    } else {
        for (const ext of file_extension_list) {
            if (url.endsWith(ext)) {
                type = 'file';
            }
        }
    }
    return {exist, type};
}

export { interpretateUrl };