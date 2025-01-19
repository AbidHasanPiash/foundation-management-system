const id = (url) => {
    const regExp =
        /^.*(?:youtu.be\/|v\/|watch\?v=|embed\/|watch\?.*v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
};

const thumbnail = (id) => {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

const getYoutubeVideo = {
    id,
    thumbnail,
};

export default getYoutubeVideo;
