import TelegramBot from 'node-telegram-bot-api';

export interface CommonCommandType {
    bot: TelegramBot;
    userId: number;
    database: any;
}