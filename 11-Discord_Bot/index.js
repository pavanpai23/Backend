import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  message.reply({
    content: "Hi From Bot",
  });
});

client.on("interactionCreate", (interaction) => {
  console.log(interaction);
  interaction.reply("Pong!");
});

client.login(
  "MTU1NDE3MzgxMzE0NTQ3NzI1MA.GRUm4V.XDbROE1X-aoDXb9goYqAyjj9Rs8T7-4HAKwD4w",
);
