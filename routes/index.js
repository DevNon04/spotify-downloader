var express = require('express');
var router = express.Router();
const axios = require('axios');
const https = require('https');

// /* GET home page. */
// router.get('/', function (req, res, next) {
//     res.render('index', {title: 'Express'});
// });

const api = "https://api.fabdl.com/spotify/get"
const apiConvert = "https://api.fabdl.com/spotify/mp3-convert-task/"
const apiDownload = "https://api.fabdl.com/spotify/download-mp3/"

router.get('/download', async function (req, res, next) {
    try {
        const {url} = req.query
        console.log(url)
        const header = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Origin': 'https://keepvid.ch',
            'Priority': 'u=1, i',
            'Referer': 'https://keepvid.ch/spotify-download-new12',
            'Sec-CH-UA': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            'Sec-CH-UA-Mobile': '?0',
            'Sec-CH-UA-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
        };
        const result = await axios.get(api, {
            headers: header,
            params: {url}
        })
        const name = result.data.result.name;
        const image = result.data.result.image;
        const owner = result.data.result.owner;
        const tracks = result.data.result.tracks

        res.status(200).json(result.data)

    } catch (e) {
        console.log(e)
    }
})

router.get("/convert-task", async function (req, res, next) {
    try {
        const {id, gid} = req.query
        console.log(id)
        console.log(gid)
        const header = {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'Origin': 'https://keepvid.ch',
            'Priority': 'u=1, i',
            'Referer': 'https://keepvid.ch/spotify-download-new12',
            'Sec-CH-UA': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
            'Sec-CH-UA-Mobile': '?0',
            'Sec-CH-UA-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
        };
        const url = `${apiConvert}${gid}/${id}`
        console.log(url)
        const agent = new https.Agent({
            keepAlive: true,
            rejectUnauthorized: false, // Không khuyến khích dùng trong môi trường sản xuất
            secureOptions: require('constants').SSL_OP_LEGACY_SERVER_CONNECT
        });
        const result = await axios.get(url, {
            headers: header,
            httpsAgent: agent
        })

        console.log(result.data)
        res.status(200).json(
            result.data
        )

    } catch (e) {
        console.log(e)
    }
})

router.get('/download-mp3', async function (req, res) {
    try {
        const { tid } = req.query; // Lấy tham số tid từ query
        if (!tid) {
            return res.status(400).json({ message: 'tid is required' });
        }

        const url = `${apiDownload}${tid}`;
        console.log(`Fetching URL: ${url}`);

        // Gửi yêu cầu GET tới API của bên thứ ba
        const response = await axios.get(url, {
            responseType: 'arraybuffer' // Yêu cầu dữ liệu dưới dạng buffer (arraybuffer)
        });

        // Chuyển tiếp các headers thích hợp từ response gốc
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('Content-Disposition', response.headers['content-disposition']);

        // Gửi dữ liệu tới client
        res.status(200).send(response.data);

    } catch (e) {
        console.error(`Error: ${e.message}`);
        res.status(500).json({ message: 'Internal server error', error: e.message });
    }
});

// router.get('/download-mp3', async function (req, res) {
//     try {
//         const {tid} = req.query
//         console.log(tid)
//
//         const result = await fetch(`${apiDownload}${tid}`)
//         console.log(result)
//         res.status(200).json(result)
//
//     } catch (e) {
//         console.log(e)
//     }
// })

module.exports = router;
