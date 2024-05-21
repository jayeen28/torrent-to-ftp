# REFERENCE: https://github.com/qbittorrent/docker-qbittorrent-nox
export \
  QBT_EULA="accept" \
  QBT_VERSION="4.4.5-1" \
  QBT_WEBUI_PORT=8080 \
  QBT_CONFIG_PATH="$(pwd)/config" \
  QBT_DOWNLOADS_PATH="$(pwd)/downloads"
docker run \
  -t \
  --name qbittorrent-nox \
  --read-only \
  --restart unless-stopped \
  --stop-timeout 1800 \
  --tmpfs /tmp \
  -e QBT_EULA \
  -e QBT_WEBUI_PORT \
  -p "127.0.0.1:$QBT_WEBUI_PORT":"$QBT_WEBUI_PORT"/tcp \
  -p 6881:6881/tcp \
  -p 6881:6881/udp \
  -v "$QBT_CONFIG_PATH":/config \
  -v "$QBT_DOWNLOADS_PATH":/downloads \
  -d \
  qbittorrentofficial/qbittorrent-nox:${QBT_VERSION}