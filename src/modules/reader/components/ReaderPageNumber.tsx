/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ReaderService } from '@/modules/reader/services/ReaderService.ts';
import {
    IReaderSettings,
    ProgressBarType,
    ReadingDirection,
    TReaderScrollbarContext,
} from '@/modules/reader/types/Reader.types.ts';
import { userReaderStatePagesContext } from '@/modules/reader/contexts/state/ReaderStatePagesContext.tsx';
import { getPage } from '@/modules/reader/utils/ReaderProgressBar.utils.tsx';
import { useNavBarContext } from '@/modules/navigation-bar/contexts/NavbarContext.tsx';
import { useReaderProgressBarContext } from '@/modules/reader/contexts/ReaderProgressBarContext.tsx';
import { useReaderScrollbarContext } from '@/modules/reader/contexts/ReaderScrollbarContext.tsx';
import { reverseString } from '@/util/Strings.ts';
import { NavbarContextType } from '@/modules/navigation-bar/NavigationBar.types.ts';
import { ReaderStatePages, TReaderProgressBarContext } from '@/modules/reader/types/ReaderProgressBar.types.ts';
import { withPropsFrom } from '@/modules/core/hoc/withPropsFrom.tsx';

const BaseReaderPageNumber = ({
    isDesktop,
    scrollbarXSize,
    readerNavBarWidth,
    isMaximized,
    currentPageIndex,
    pages,
    totalPages,
    progressBarType,
    shouldShowPageNumber,
    readingDirection,
}: Pick<TReaderScrollbarContext, 'scrollbarXSize'> &
    Pick<ReturnType<typeof ReaderService.useOverlayMode>, 'isDesktop'> &
    Pick<NavbarContextType, 'readerNavBarWidth'> &
    Pick<TReaderProgressBarContext, 'isMaximized'> &
    Pick<ReaderStatePages, 'currentPageIndex' | 'pages' | 'totalPages'> &
    Pick<IReaderSettings, 'progressBarType' | 'shouldShowPageNumber' | 'readingDirection'>) => {
    const pageName = useMemo(() => {
        const currentPageName = getPage(currentPageIndex, pages).name;
        const SEPARATOR = '/';
        const tmpPageName = `${currentPageName}${SEPARATOR}${totalPages}`;

        return readingDirection === ReadingDirection.LTR ? tmpPageName : reverseString(tmpPageName, SEPARATOR);
    }, [currentPageIndex, pages, totalPages, readingDirection]);

    if (!shouldShowPageNumber) {
        return null;
    }

    if (isMaximized) {
        return null;
    }

    if (isDesktop && progressBarType === ProgressBarType.STANDARD) {
        return null;
    }

    if (isMaximized && progressBarType === ProgressBarType.HIDDEN) {
        return null;
    }

    return (
        <Stack
            sx={{
                position: 'fixed',
                left: readerNavBarWidth,
                right: 0,
                bottom: (theme) => `max(calc(${theme.spacing(1)} + ${scrollbarXSize}px), env(safe-area-inset-bottom))`,
                alignItems: 'center',
                transition: (theme) => `left 0.${theme.transitions.duration.shortest}s`,
            }}
        >
            <Box
                sx={{
                    p: 0.5,
                    borderRadius: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
            >
                <Typography sx={{ color: 'white' }}>{pageName}</Typography>
            </Box>
        </Stack>
    );
};

export const ReaderPageNumber = withPropsFrom(
    BaseReaderPageNumber,
    [
        ReaderService.useOverlayMode,
        useReaderScrollbarContext,
        useNavBarContext,
        useReaderProgressBarContext,
        userReaderStatePagesContext,
        ReaderService.useSettingsWithoutDefaultFlag,
    ],
    [
        'isDesktop',
        'scrollbarXSize',
        'readerNavBarWidth',
        'isMaximized',
        'currentPageIndex',
        'pages',
        'totalPages',
        'progressBarType',
        'shouldShowPageNumber',
        'readingDirection',
    ],
);
