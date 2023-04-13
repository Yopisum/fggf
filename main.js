const mineflayer = require('mineflayer');
const auth = require('mineflayer-auth');

const bot = mineflayer.createBot({
  host: 'localhost', // Адрес сервера
  port: 28960, // Порт сервера
  username: 'Bot' // Имя бота
});

bot.on('spawn', () => {
  // Код, который будет выполнен после того, как бот зайдет на сервер
  const mcData = require('minecraft-data')(bot.version);
  const movements = new Movements(bot, mcData);

  auth(bot, {
    email: 'growcastle278@gmail.com', // Электронная почта для авторизации
    password: 'kjdbfkjd', // Пароль для авторизации
    register: true, // Регистрация, если пользователь не зарегистрирован на сервере
    username: 'Bot' // Имя бота для регистрации
  }, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Bot is authenticated and registered!');
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const target = bot.players[username]?.entity;

    if (message === 'start') {
      bot.pathfinder.setMovements(movements);
      bot.pathfinder.setGoal(new GoalFollow(target, 2), true);
    } else if (message === 'stop') {
      bot.pathfinder.setGoal(null);
    }
  });

  setInterval(() => {
    if (bot.pathfinder.isMoving()) return;

    const x = bot.entity.position.x;
    const z = bot.entity.position.z;
    const radius = 10;
    const theta = Math.random() * 2 * Math.PI;

    const targetX = x + radius * Math.cos(theta);
    const targetZ = z + radius * Math.sin(theta);

    bot.pathfinder.setMovements(movements);
    bot.pathfinder.setGoal(new GoalNear(targetX, bot.entity.position.y, targetZ, 1));
  }, 30000);
});
