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
    },
    custom_Source_Toggle: {
        type: OptionType.BOOLEAN,
        description: "Enable the custom sound source *(note: link must be from discord and must be a mp3)",
        default: false
    },
    custom_Source: {
        type: OptionType.STRING,
        description: "Source sound *(note: link must be from discord and must be a mp3)",
        default: "https://cdn.discordapp.com/attachments/1101301651022827550/1408122056217727006/sansDialogue.mp3?ex=68a8975b&is=68a745db&hm=2142fe623ed422cb61e9ffbecfc53e770f85addc23d4615d0a4dc19d57f416cc&",
        restartNeeded: true
    },
    custom_Speed: {
        type: OptionType.NUMBER,
        description: "How long each character is *(in ms)",
        default: 21
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
            if (optimistic || type !== "MESSAGE_CREATE" || message.state === "SENDING" || !message.content || message.content.includes("https://") || channelId !== SelectedChannelStore.getChannelId()) return;
            console.log(message.author.id);
            playDialogueSound(message.content);
        }
    },
    start() {
        console.log("Ralsei online!!");
        if (settings.plain.custom_Source_Toggle && (!settings.plain.custom_Source.includes(".mp3") || !settings.plain.custom_Source.startsWith("https://cdn.discordapp.com/attachments/"))) {
            alert("Invalid Sound");
            settings.plain.custom_Source_Toggle = false;
        }
    }
});

const audioEvent = document.createElement("audio");

async function playDialogueSound(content: string) {
    let workTime: number;
    let speed: number;

    let sound = settings.store.source_Sound;
    if (settings.plain.custom_Source_Toggle) sound = settings.plain.custom_Source;
    audioEvent.src = sound;
    audioEvent.loop = true;
    audioEvent.volume = settings.store.volume;



    // Speed check

    if (!settings.plain.custom_Source_Toggle) {
        if (settings.plain.source_Sound.includes("RalseiDialogue.mp3")) speed = 33;
        else if (settings.plain.source_Sound.includes("Spamton.mp3")) speed = 50;
        else speed = 21;
    } else speed = settings.plain.custom_Speed;

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
