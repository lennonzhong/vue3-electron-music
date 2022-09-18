import kugou from "./kugou";
import qq from "./qq";
import kuwo from "./kuwo"
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line no-useless-escape
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);

    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.getParameterByName = getParameterByName;


export const MusicSource = {
    "netease": "网易云音乐",
    "bilibili": "bilibili",
    "kugou": "酷狗音乐",
    "kuwo": "酷我音乐",
    "migu": "咪咕音乐",
    "qq": "QQ音乐",
    "xiami": "虾米音乐",
    "taihe": "千千静听",
}

const MusciService = {
    kugou,
    qq,
    kuwo
}
export default MusciService

window.MusciService = MusciService