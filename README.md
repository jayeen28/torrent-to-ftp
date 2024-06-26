# Project Description
This project provides an automated setup for running a qBittorrent client within a Docker container, alongside a Telegram bot for remote control the qBittorrent and an FTP server for accessing downloaded files. The primary purpose is to simplify the process of managing torrent downloads and making them easily accessible via an FTP server. Users can start the torrent client, control it remotely through a Telegram bot, and access their downloaded files from any FTP client. You can have different use cases. But my purpose was to download movies whenever I want in my private server through telegram and access them using vlc player in my phone or laptop.

# Startup
1. First clone this repo.
1. Setup `.env` variables. Checkout `.env.example` for reference.
1. Install docker if you don't have already installed.
1. Then run `docker compose up -d`. Your machine should have 21 and 21000-21010 ports available because it is a passive ftp connection. If not then configure that in the docker compose file.
1. Run `yarn start` or `node index.js` to start the telegram bot. Use `pm2` if you want to run it in the background.

## Screenshots

1. **The `/start` command**:
   ![The `/start` command](https://raw.githubusercontent.com/jayeen28/torrent-to-ftp/main/screen_shots/Screenshot%20from%202024-05-21%2016-49-42.png)

1. **The `/add magnetLink` command**:
   ![The `/add magnetLink` command](https://raw.githubusercontent.com/jayeen28/torrent-to-ftp/main/screen_shots/Screenshot%20from%202024-05-21%2016-50-49.png)

1. **The `/seAll` command**:
   ![The `/seeAll` command](https://raw.githubusercontent.com/jayeen28/torrent-to-ftp/main/screen_shots/Screenshot%20from%202024-05-21%2016-51-13.png)