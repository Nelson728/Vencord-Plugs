/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { sleep } from "@utils/misc";
import definePlugin, { OptionType } from "@utils/types";
import { Message } from "@vencord/discord-types";
import { SelectedChannelStore } from "@webpack/common";


interface IMessageCreate {
    type: "MESSAGE_CREATE";
    channelId: string;
    message: Message;
}

const settings = definePluginSettings({
    volume: {
        type: OptionType.SLIDER,
        description: "The volume of the sound effect.",
        markers: [0, 0.25, 0.50, 0.75, 1],
        default: 0.5,
        stickToMarkers: false

    }
});

export default definePlugin({
    name: "Ralsei Dialogue Sound",
    description: "Plays Ralsei's dialogue sounds when someone messages in your channel.",
    version: "0.2.1",
    authors: [{ name: "Nellium", id: 554010229625454612n }],
    settings,
    flux: {
        async MESSAGE_CREATE({ type, message, channelId }: IMessageCreate) {
            if (type !== "MESSAGE_CREATE") return;
            if (message.state === "SENDING") return;
            if (!message.content) return;
            if (message.content.startsWith("http")) return;
            if (channelId !== SelectedChannelStore.getChannelId()) return;

            console.log(message.content);
            dioSoung(message.content);
        }
    },
    start() {
        console.log("Ralsei online!!");
    }
});

const audioEvent = document.createElement("audio");
const sound = "https://github.com/Nelson728/Vencord-Plugs/raw/main/Ralsei%20Dialogue/RalseiDialogue.mp3";
audioEvent.src = sound;
audioEvent.volume = 0.5;
audioEvent.loop = true;

async function dioSoung(content: string) {
    audioEvent.volume = settings.store.volume;
    const arg = content.split(" ");
    let workTime: number;
    const argLen = arg.length;

    for (let i = 0; i < argLen; i++) {
        workTime = arg[i].length;
        audioEvent.play();
        await sleep(workTime * 33);
        audioEvent.pause();
        audioEvent.currentTime = 0;
        if (arg[i].endsWith(".")) {
            await sleep(500);
        } else if (arg[i].endsWith(",")) {
            await sleep(250);
        }
    }
}
