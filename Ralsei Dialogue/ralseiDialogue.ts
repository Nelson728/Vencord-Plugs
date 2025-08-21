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
            }
        ]
    }
});

export default definePlugin({
    name: "Ralsei Dialogue Sound",
    description: "Plays Ralsei's dialogue sounds when someone messages in your channel.",
    version: "0.3.2",
    authors: [{ name: "Nellium", id: 554010229625454612n }],
    settings,
    flux: {
        async MESSAGE_CREATE({ type, message, channelId }: IMessageCreate) {
            if (type !== "MESSAGE_CREATE") return;
            if (message.state === "SENDING") return;
            if (!message.content) return;
            if (message.content.startsWith("http")) return;
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
    let speed: number = 21;

    if (settings.plain.source_Sound === "Ralsei") speed = 33;


    for (let i = 0; i < argLen; i++) {
        workTime = arg[i].length;
        await audioEvent.play();
        await sleep(workTime * speed);
        audioEvent.pause();
        audioEvent.currentTime = audioTimeing;
        if (arg[i].endsWith(".")) {
            await sleep(500);
        } else if (arg[i].endsWith(",")) {
            await sleep(250);
        }
    }
}
