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
    sourceSound: {
        type: OptionType.SELECT,
        description: "What sound you want to use",
        options: [
            {
                label: "Ralsei",
                value: "https://github.com/Nelson728/Vencord-Plugs/raw/main/Sounds/ralsei-talk.mp3",
                default: true
            },
            {
                label: "Sans",
                value: "https://github.com/Nelson728/Vencord-Plugs/raw/main/Sounds/sansDialogue.mp3"
            },
            {
                label: "Noelle",
                value: "https://github.com/Nelson728/Vencord-Plugs/raw/main/Sounds/noelle.mp3"
            },
            {
                label: "Spamton",
                value: "https://github.com/Nelson728/Vencord-Plugs/raw/main/Sounds/Spamton.mp3"
            }
        ]
    },
    customSourceToggle: {
        type: OptionType.BOOLEAN,
        description: "Enable the custom sound source *(note: link must be from discord and must be a mp3)",
        default: false
    },
    customSource: {
        type: OptionType.STRING,
        description: "Source sound *(note: link must be from Discord/raw Github and must be a mp3)",
        default: "https://github.com/Nelson728/Vencord-Plugs/raw/main/Sounds/Coins.mp3",
        restartNeeded: true
    },
    customSpeed: {
        type: OptionType.NUMBER,
        description: "How long each character is *(in ms)",
        default: 21
    },
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
            if (optimistic || type !== "MESSAGE_CREATE" || message.state === "SENDING" || !message.content || message.content.includes("https://") || channelId !== SelectedChannelStore.getChannelId()) return;
            playDialogueSound(message.content);
        }
    },
    start() {
        console.log("Ralsei online!!");
        if (settings.plain.customSourceToggle && (!settings.plain.customSource.includes(".mp3") || !settings.plain.customSource.startsWith("https://cdn.discordapp.com/attachments/"))) {
            alert("Invalid Sound");
            settings.plain.customSourceToggle = false;
        }
    }
});

const audioEvent = document.createElement("audio");

async function playDialogueSound(content: string) {
    let workTime: number;
    let speed: number;

    let sound = settings.store.sourceSound;
    if (settings.plain.customSourceToggle) sound = settings.plain.customSource;
    audioEvent.src = sound;
    audioEvent.loop = true;
    audioEvent.volume = settings.store.volume;

    // Speed check

    if (!settings.plain.customSourceToggle) {
        if (settings.plain.sourceSound.includes("RalseiDialogue.mp3")) speed = 33;
        else if (settings.plain.sourceSound.includes("Spamton.mp3")) speed = 50;
        else speed = 21;
    } else speed = settings.plain.customSpeed;

    // Sound handler

    for (const e of content.split(" ")) {
        if (e.startsWith("<:") && e.endsWith(">")) continue;

        workTime = e.length;
        await audioEvent.play();
        await sleep(workTime * speed);
        audioEvent.pause();
        audioEvent.currentTime = 0;

        const _punc = e.slice(e.length - 1);
        switch (_punc) {
            case ".":
                await sleep(500);
                continue;
            case ",":
                await sleep(250);
                continue;
            default:
                await sleep(speed);
                continue;
        }
    }
}
