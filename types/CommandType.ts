import TelegramBot from 'node-telegram-bot-api';
import { Database } from './Database';

export interface CommonCommandType {
    bot: TelegramBot;
    userId: number;
    database: Database;
}