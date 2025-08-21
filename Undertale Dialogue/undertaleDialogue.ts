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
    optimistic: boolean;
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

    },
    source_Sound: {
        type: OptionType.SELECT,
        description: "What sound you want to use",
        options: [
            {
                label: "Ralsei",
                value: "https://cdn.discordapp.com/attachments/1088254993276092516/1408067156926529676/RalseiDialogue.mp3?ex=68a8643a&is=68a712ba&hm=a7cff4e1f13d16aa08cdadfb2c23237893928dcaa58bb47d281c2f9ac2fbf52c&",
                default: true
            },
            {
                label: "Sans",
                value: "https://cdn.discordapp.com/attachments/1101301651022827550/1408122056217727006/sansDialogue.mp3?ex=68a8975b&is=68a745db&hm=2142fe623ed422cb61e9ffbecfc53e770f85addc23d4615d0a4dc19d57f416cc&"
            },
            {
                label: "Noelle",
                value: "https://cdn.discordapp.com/attachments/1088254993276092516/1408151025906356316/noelle.mp3?ex=68a8b256&is=68a760d6&hm=31496862d67b883d0d19383fd9589c2a374ff5a965cb1456432fc8b9374d9690&"
            },
            {
                label: "Spamton",
                value: "https://cdn.discordapp.com/attachments/1088254993276092516/1408178895907192992/Spamton.mp3?ex=68a8cc4b&is=68a77acb&hm=6c123aa671e4ff8a9eb41f598282dfebc10a23ee7f65b85579fe68115699b6e2&"
            }
        ]
    }
});

export default definePlugin({
    name: "Undertale/Deltarune Dialogue Sound",
    description: "Plays dialogue sounds when someone messages in your channel.",
    version: "0.3.3",
    authors: [{ name: "Nellium", id: 554010229625454612n }],
    settings,
    flux: {
        async MESSAGE_CREATE({ type, optimistic, message, channelId }: IMessageCreate) {
            // const myId = UserStore.getCurrentUser().id;
            if (optimistic || type !== "MESSAGE_CREATE") return;
            if (message.state === "SENDING") return;
            if (!message.content) return;
            if (message.content.includes("https://")) return;
            if (channelId !== SelectedChannelStore.getChannelId()) return;

            console.log(message.author.id);
            dioSoung(message.content);
        }
    },
    start() {
        console.log("Ralsei online!!");
    }
});

const audioEvent = document.createElement("audio");

async function dioSoung(content: string) {
    const sound = settings.store.source_Sound;
    audioEvent.src = sound;
    audioEvent.loop = true;
    audioEvent.volume = settings.store.volume;
    const audioTimeing: number = 0.001;

    const arg = content.split(" ");
    let workTime: number;
    const argLen = arg.length;
    let speed: number;
    if (settings.plain.source_Sound.includes("RalseiDialogue.mp3")) speed = 33;
    else if (settings.plain.source_Sound.includes("Spamton.mp3")) speed = 50;
    else speed = 21;

    for (let i = 0; i < argLen; i++) {
        if (arg[i].startsWith("<:") && arg[i].endsWith(">")) continue;
        workTime = arg[i].length;
        await audioEvent.play();
        await sleep(workTime * speed);
        audioEvent.pause();
        audioEvent.currentTime = audioTimeing;
        if (arg[i].endsWith(".")) {
            await sleep(500);
        } else if (arg[i].endsWith(",")) {
            await sleep(250);
        } else {
            await sleep(speed);
        }
    }
}
