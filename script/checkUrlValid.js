/* This script check if URL is in valid format using RegEx */
function checkUrlValid(url) {
    const pattern = /^(?:(?:https?|s?ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i;
    return !!pattern.test(url);
}

export { checkUrlValid };