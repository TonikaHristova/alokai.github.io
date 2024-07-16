FROM mcr.microsoft.com/playwright:v1.44.0-jammy

RUN mkdir /app
WORKDIR root/app
COPY . /app/

RUN npm install --force
RUN npx playwright install
RUN npm install playwright-core
