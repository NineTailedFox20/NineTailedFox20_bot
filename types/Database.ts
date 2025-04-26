interface User {
    lastBonus: string;
    balance: number;
}

interface GiftCard {
    code: string;
    value: number;
}

export interface Database {
    users: {
        [userId: string]: User;
    };
    giftCards: GiftCard[];
    admins: string[];
}