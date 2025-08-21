/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { sleep } from "@utils/misc";
import definePlugin from "@utils/types";
import { Message } from "@vencord/discord-types";
import { SelectedChannelStore } from "@webpack/common";


interface IMessageCreate {
    type: "MESSAGE_CREATE";
    channelId: string;
    message: Message;
}

export default definePlugin({
    name: "Ralsei Dialogue Sound",
    description: "Plays Ralsei's dialogue sounds when someone messages in your channel.",
    version: "0.1.0",
    authors: [{ name: "Nellium", id: 554010229625454612n }],
    flux: {
        async MESSAGE_CREATE({ type, message, channelId }: IMessageCreate) {
            if (type !== "MESSAGE_CREATE") return;
            if (message.state === "SENDING") return;
            if (!message.content) return;
            if (message.content.startsWith("http")) return;
            if (channelId !== SelectedChannelStore.getChannelId()) return;

            const messageLen = message.content.length;
            dioSoung(messageLen);

            console.log(message.content);
        }
    },
    start() {
        console.log("Ralsei online!!");
    }
});

const audioEvent = document.createElement("audio");
const sound = "https://cdn.discordapp.com/attachments/1101301651022827550/1407940037206872174/RalseiDialogue.mp3?ex=68a7edd7&is=68a69c57&hm=e9cc2439b53550a1131d792fe8982344e9d4bd0afd09ac9debf392cb5c579fc9&";
audioEvent.src = sound;
audioEvent.volume = 0.5;
audioEvent.loop = true;
async function dioSoung(char: number) {
    audioEvent.play();
    await sleep(char * 33);
    audioEvent.pause();
    audioEvent.currentTime = 0;
}
