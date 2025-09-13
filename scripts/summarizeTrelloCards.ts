import axios from 'axios';
import dayjs from 'dayjs';

const trelloApiKey = process.env.TRELLO_API_KEY;
const trelloApiToken = process.env.TRELLO_API_TOKEN;
const trelloBoardId = process.env.TRELLO_BOARD_ID;
const trelloTargetListId = process.env.TRELLO_TARGET_LIST_ID;

type Card = {
    id: string;
    due: string;
    idList: string;
    labels?: {
        id: string;
        idBoard: string;
        name: string;
        color: string;
        uses: number;
    }[];
    name: string;
};

const main = async () => {
    const { data: cards } = await axios.get<Card[]>(
        `https://api.trello.com/1/boards/${trelloBoardId}/cards`,
        {
            params: {
                key: trelloApiKey,
                token: trelloApiToken,
            },
        },
    );
    const cardsOnTargetList = cards.filter(
        card => card.idList === trelloTargetListId,
    );
};

main();
