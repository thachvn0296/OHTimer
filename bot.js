const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
require('dotenv').config();

// Create the Client instance 
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Logic calculating target 4-hour UTC game loot cycle windows
function getNextResetData() {
  const now = new Date();
  const currentUtcHours = now.getUTCHours();

  // Once Human refreshes every 4 hours: 0, 4, 8, 12, 16, 20 UTC
  const nextUtcHour = Math.ceil((currentUtcHours + 0.0001) / 4) * 4;

  const target = new Date(now);
  target.setUTCHours(nextUtcHour, 0, 0, 0);

  let diff = target - now;
  if (diff <= 0) diff = 0;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Creates native Discord markdown timestamps so it auto-converts to each player's local timezone
  const timestampCode = Math.floor(target.getTime() / 1000);
  const discordTimestamp = `<t:${timestampCode}:R>`;
  const discordExactTime = `<t:${timestampCode}:t>`;

  return {
    countdown: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    relative: discordTimestamp,
    exact: discordExactTime
  };
}

// Map slash configurations
const commands = [
  new SlashCommandBuilder()
    .setName('timer')
    .setDescription('Get the remaining time until the next Once Human loot reset.')
].map(command => command.toJSON());

client.once('ready', async () => {
  console.log(`Bot successfully logged in as ${client.user.tag}!`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error(error);
  }
});

// Run interaction processing whenever /timer is triggered
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'timer') {
    const timeData = getNextResetData();

    const embed = new EmbedBuilder()
      .setColor(0x3b82f6)
      .setTitle('🛡️ Once Human Global Loot Reset')
      .setDescription('World crates reset globally.')
      .addFields(
        { name: '⏰ Time Remaining', value: `\`${timeData.countdown}\` (${timeData.relative})`, inline: false },
        { name: '🌐 Your Next Local Reset', value: `${timeData.exact}`, inline: false }
      )
      .setFooter({ text: 'Timer syncs automatically with server cycles' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
});

// Init connection
client.login(process.env.DISCORD_TOKEN);