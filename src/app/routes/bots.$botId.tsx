import { Bot } from '~/model/bot'

export default function BotPage() {
  const bot: Bot = {
    name: 'Этот бот',
  }

  return (
    <div id="contact">
      <div>
        {/* <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        /> */}
      </div>

      <div>
        <h1>
          {bot.name}
        </h1>
      </div>
    </div>
  )
}