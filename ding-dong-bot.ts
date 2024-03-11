import { generate } from 'qrcode-terminal';
import { Contact, Message, ScanStatus, WechatyBuilder, log } from 'wechaty';

require('dotenv').config();

const BOT_NAME = 'DingDongBot';

// function to handle QR code generation
function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    generate(qrcode, { small: true }); // show qrcode on console

    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('');

    log.info(
      BOT_NAME,
      'onScan: %s(%s) - %s',
      ScanStatus[status],
      status,
      qrcodeImageUrl
    );
  } else {
    log.info(BOT_NAME, 'onScan: %s(%s)', ScanStatus[status], status);
  }
}

// function to handle user login
function onLogin(user: Contact) {
  log.info(BOT_NAME, '%s login', user);
}

// function to handle user logout
function onLogout(user: Contact) {
  log.info(BOT_NAME, '%s logout', user);
}

// function to parse message and replay to them
// parse "ding" ---> replay "dong"
async function onMessage(message: Message) {
  try {
    log.info(BOT_NAME, message.toString());
    if (message.text() === 'ding') {
      await message.say('dong');
    }
  } catch (e) {
    log.error(BOT_NAME, e);
  }
}

// start bot
async function startBot() {
  try {
    await bot.start();
    log.info(BOT_NAME, 'Bot Started.');
  } catch (e) {
    log.error(BOT_NAME, e);
  }
}

// initializing the bot
const bot = WechatyBuilder.build({
  name: BOT_NAME,
});

// handle events of the bot
bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);

startBot();
