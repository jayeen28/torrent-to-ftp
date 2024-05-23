import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
export default class QbApi {
    constructor(_username, _password) {
        this.username = _username;
        this.password = _password;
        this.sid = undefined;
        this.QB_URL = process.env.QB_URL;
        this.auth_interval_id = undefined;
    }
    qb_req({ uri, method = 'GET', headers = {}, auth = true, data }) {
        if (auth && !this.sid) throw new Error(`No sid available to request for ${uri}`);
        return axios({
            url: `${this.QB_URL}/api/v2${uri}`,
            method,
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": this.QB_URL,
                "Referrer-Policy": "same-origin",
                ...(auth ? { "cookie": `${this.sid}` } : {}),
                ...headers,
            },
            ...(data ? { data } : {})
        });
    }
    async authenticate() {
        const res = await this.qb_req({ uri: '/auth/login', method: 'POST', auth: false, data: `username=${this.username}&password=${this.password}` });
        const [sidCookie] = res.headers['set-cookie'];
        if (!sidCookie || !sidCookie.includes("SID")) throw new Error(`Invalid SID. Found SID: ${sid}`);
        this.sid = sidCookie.split(';')[0];
        if (!this.auth_interval_id) this.auth_interval_id = setInterval(() => this.authenticate(), 5 * 60 * 60 * 1000);// every 5 hour
    }
    async add_torrent(magnet_link) {
        try {
            // Create a new FormData object
            const formData = new FormData();

            // Append fields to the FormData object
            formData.append('urls', magnet_link);
            formData.append('autoTMM', 'false');
            formData.append('savepath', '');
            formData.append('cookie', '');
            formData.append('rename', '');
            formData.append('category', '');
            formData.append('paused', 'false');
            formData.append('contentLayout', 'Original');
            formData.append('dlLimit', 'NaN');
            formData.append('upLimit', 'NaN');

            const { data } = await this.qb_req({ uri: '/torrents/add', method: 'POST', data: formData });
            if (data === "Ok.") return { status: true, message: 'Torrent added successfully' };
            else return { status: false, message: data };
        }
        catch (e) {
            console.log(e);
            return { status: false, message: e.message }
        }
    }

    async get_torrents() {
        try {
            const { data } = await this.qb_req({ uri: '/sync/maindata' });
            return { status: true, data };
        }
        catch (e) {
            console.log(e);
            return { status: false, message: e.message }
        }
    }
    async rm_torrent(hash) {
        try {
            const { status } = await this.qb_req({ uri: '/torrents/delete', method: 'POST', data: `hashes=${hash}&deleteFiles=true` });
            if (status === 200) return { status: true };
            else return { status: false, message: 'Torrent not removed' };
        }
        catch (e) {
            console.log(e);
            return { status: false, message: e.message };
        }
    }
}