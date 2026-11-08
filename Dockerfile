# صورة جاهزة للاستضافات التي تدعم Docker: Koyeb / Railway / Fly.io / أي VPS
FROM node:20-slim

ENV NODE_ENV=production

WORKDIR /app

# ffmpeg مطلوب لمعرفة مدة فيديوهات القصص (اختياري، يمكن حذفه لتسريع البناء)
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY . .

RUN mkdir -p uploads/site uploads/pic uploads/picroom uploads/sendfile \
    uploads/story uploads/emo uploads/sico uploads/dro3 uploads/atar \
    uploads/back uploads/recorder database \
    && chown -R node:node /app

USER node

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
