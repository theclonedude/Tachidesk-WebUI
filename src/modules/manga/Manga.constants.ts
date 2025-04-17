/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { MangaStatus } from '@/lib/graphql/generated/graphql.ts';
import { TranslationKey } from '@/Base.types.ts';
import { MangaAction, MangaIdInfo, MangaType } from '@/modules/manga/Manga.types.ts';

export const FALLBACK_MANGA: MangaIdInfo = { id: -1 };

export const GLOBAL_READER_SETTINGS_MANGA: MangaIdInfo = { id: -2 };

export const MANGA_COVER_ASPECT_RATIO = '1 / 1.5';

export const statusToTranslationKey: Record<MangaStatus, TranslationKey> = {
    [MangaStatus.Cancelled]: 'manga.status.cancelled',
    [MangaStatus.Completed]: 'manga.status.completed',
    [MangaStatus.Licensed]: 'manga.status.licensed',
    [MangaStatus.Ongoing]: 'manga.status.ongoing',
    [MangaStatus.OnHiatus]: 'manga.status.hiatus',
    [MangaStatus.PublishingFinished]: 'manga.status.publishing_finished',
    [MangaStatus.Unknown]: 'manga.status.unknown',
};

export const actionToTranslationKey: {
    [key in MangaAction]: {
        action: {
            single: TranslationKey;
            selected: TranslationKey;
        };
        success: TranslationKey;
        error: TranslationKey;
    };
} = {
    download: {
        action: {
            single: 'chapter.action.download.add.label.action',
            selected: 'chapter.action.download.add.button.selected',
        },
        success: 'chapter.action.download.add.label.success',
        error: 'chapter.action.download.add.label.error',
    },
    delete: {
        action: {
            single: 'chapter.action.download.delete.label.action',
            selected: 'chapter.action.download.delete.button.selected',
        },
        success: 'chapter.action.download.delete.label.success',
        error: 'chapter.action.download.delete.label.error',
    },
    mark_as_read: {
        action: {
            single: 'chapter.action.mark_as_read.add.label.action.current',
            selected: 'chapter.action.mark_as_read.add.button.selected',
        },
        success: 'chapter.action.mark_as_read.add.label.success',
        error: 'chapter.action.mark_as_read.add.label.error',
    },
    mark_as_unread: {
        action: {
            single: 'chapter.action.mark_as_read.remove.label.action',
            selected: 'chapter.action.mark_as_read.remove.button.selected',
        },
        success: 'chapter.action.mark_as_read.remove.label.success',
        error: 'chapter.action.mark_as_read.remove.label.error',
    },
    remove_from_library: {
        action: {
            single: 'manga.action.library.remove.label.action',
            selected: 'manga.action.library.remove.button.selected',
        },
        success: 'manga.action.library.remove.label.success',
        error: 'manga.action.library.remove.label.error',
    },
    change_categories: {
        action: {
            single: 'manga.action.category.label.action',
            selected: 'manga.action.category.button.selected',
        },
        success: 'manga.action.category.label.success',
        error: 'manga.action.category.label.error',
    },
    migrate: {
        action: {
            single: 'global.button.migrate',
            selected: 'global.button.migrate', // not supported
        },
        success: 'manga.action.migrate.label.success',
        error: 'manga.action.migrate.label.error',
    },
    track: {
        action: {
            single: 'manga.action.track.add.label.action',
            selected: 'manga.action.track.add.label.action', // not supported
        },
        success: 'manga.action.track.add.label.success',
        error: 'manga.action.track.add.label.error',
    },
};

// source: https://github.com/jobobby04/TachiyomiSY/blob/e0f40fad8c25459980ead51382c238462416f8d2/app/src/main/java/exh/util/MangaType.kt#L93
// last synced: 2025-04-18 00:06
export const SOURCES_BY_MANGA_TYPE: Record<MangaType, string[]> = {
    [MangaType.MANGA]: [],
    [MangaType.COMIC]: [
        '8muses',
        'allporncomic',
        'ciayo comics',
        'comicextra',
        'comicpunch',
        'cyanide',
        'dilbert',
        'eggporncomics',
        'existential comics',
        'hiveworks comics',
        'milftoon',
        'myhentaicomics',
        'myhentaigallery',
        'gunnerkrigg',
        'oglaf',
        'patch friday',
        'porncomix',
        'questionable content',
        'readcomiconline',
        'read comics online',
        'swords comic',
        'teabeer comics',
        'xkcd',
    ],
    [MangaType.WEBTOON]: ['mangatoon', 'manmanga', 'toomics', 'webcomics', 'webtoons', 'webtoon'],
    [MangaType.MANHWA]: [
        'hiperdex',
        'hmanhwa',
        'instamanhwa',
        'manhwa18',
        'manhwa68',
        'manhwa365',
        'manhwahentaime',
        'manhwamanga',
        'manhwatop',
        'manhwa',
        'manytoon',
        'manwha',
        'readmanhwa',
        'skymanga',
        'toonily',
        'webtoonxyz',
    ],
    [MangaType.MANHUA]: [
        '1st kiss manhua',
        'hero manhua',
        'manhuabox',
        'manhuaus',
        'manhuas',
        'manhuas',
        'readmanhua',
        'wuxiaworld',
        'manhua',
    ],
};

export const MANGA_TAGS_BY_MANGA_TYPE: Record<MangaType, TranslationKey[]> = {
    [MangaType.MANGA]: ['manga.type.manga'],
    [MangaType.COMIC]: ['manga.type.comic'],
    [MangaType.WEBTOON]: ['manga.type.webtoon', 'manga.type.long_strip'],
    [MangaType.MANHWA]: ['manga.type.manhwa', 'manga.type.long_strip'],
    [MangaType.MANHUA]: ['manga.type.manhua', 'manga.type.long_strip'],
};
