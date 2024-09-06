/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { ThemeOptions } from '@mui/material/styles';
import { t as translate } from 'i18next';
import { defaultPromiseErrorHandler } from '@/util/defaultPromiseErrorHandler.ts';

type Theme = { isCustom: boolean; getName: () => string; muiTheme: ThemeOptions };

const themes = {
    default: {
        isCustom: false,
        getName: () => translate('global.label.default'),
        muiTheme: {
            palette: {
                primary: {
                    main: '#5b74ef',
                },
                secondary: {
                    main: '#efd65b',
                },
            },
        },
    },
    lavender: {
        isCustom: false,
        getName: () => translate('settings.appearance.theme.themes.lavender'),
        muiTheme: {
            palette: {
                primary: {
                    main: '#5c58dc',
                },
                secondary: {
                    main: '#d8dc58',
                },
            },
        },
    },
    dune: {
        isCustom: false,
        getName: () => translate('settings.appearance.theme.themes.dune'),
        muiTheme: {
            palette: {
                primary: {
                    main: '#897869',
                },
                secondary: {
                    main: '#697a89',
                },
            },
        },
    },
    rosegold: {
        isCustom: false,
        getName: () => translate('settings.appearance.theme.themes.rosegold'),
        muiTheme: {
            palette: {
                primary: {
                    main: '#f1a886',
                },
                secondary: {
                    main: '#86cff1',
                },
            },
        },
    },
    'forest dew': {
        isCustom: false,
        getName: () => translate('settings.appearance.theme.themes.forest_dew'),
        muiTheme: {
            palette: {
                primary: {
                    main: '#53a584',
                },
                secondary: {
                    main: '#a55374',
                },
            },
        },
    },
    'montain sunset': {
        isCustom: false,
        getName: () => translate('settings.appearance.theme.themes.mountain_sunset'),
        muiTheme: {
            palette: {
                primary: {
                    main: '#c55a77',
                },
                secondary: {
                    main: '#5ac5a8',
                },
            },
        },
    },
    crimson: {
        isCustom: false,
        getName: () => translate('settings.appearance.theme.themes.crimson'),
        muiTheme: {
            palette: {
                primary: {
                    main: '#ff0033',
                },
                secondary: {
                    main: '#00ffcc',
                },
            },
        },
    },
    'minty miracles': {
        isCustom: false,
        getName: () => translate('settings.appearance.theme.themes.minty_miracles'),
        muiTheme: {
            palette: {
                primary: {
                    main: '#9defc3',
                },
                secondary: {
                    main: '#ef9dc9',
                },
            },
        },
    },
    'orange juice': {
        isCustom: false,
        getName: () => translate('settings.appearance.theme.themes.orange_juice'),
        muiTheme: {
            palette: {
                primary: {
                    main: '#ffb546',
                },
                secondary: {
                    main: '#4690ff',
                },
            },
        },
    },
} as const satisfies Record<string, Theme>;

export type AppThemes = keyof typeof themes | string;

export type AppTheme = Theme & { id: AppThemes; isCustom: boolean };

export const appThemes = (Object.entries(themes) as [AppThemes, Theme][]).map(([id, theme]) => ({
    id,
    ...theme,
})) satisfies AppTheme[];

export const getTheme = (id: AppThemes, customThemes: Record<string, AppTheme> = {}): AppTheme => {
    try {
        const allThemes = { ...themes, ...customThemes };
        const theme = (allThemes[id as keyof typeof themes] as AppTheme) ?? themes.default;

        return {
            // @ts-ignore - custom themes do not have a "getName" function
            getName: () => id,
            ...theme,
        };
    } catch (e) {
        defaultPromiseErrorHandler('getTheme')(e);
    }
    return { id, ...themes[id as keyof typeof themes] };
};

export const isThemeNameUnique = (id: string, customThemes: Record<string, AppTheme>): boolean =>
    Object.keys({ ...themes, ...customThemes }).every((themeId) => themeId.toLowerCase() !== id.toLowerCase());