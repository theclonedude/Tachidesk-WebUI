/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Typography from '@mui/material/Typography';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { LoadingPlaceholder } from '@/modules/core/components/feedback/LoadingPlaceholder.tsx';
import { EmptyViewAbsoluteCentered } from '@/modules/core/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { UpdateChecker } from '@/modules/core/components/UpdateChecker.tsx';
import { StyledGroupedVirtuoso } from '@/modules/core/components/virtuoso/StyledGroupedVirtuoso.tsx';
import { StyledGroupHeader } from '@/modules/core/components/virtuoso/StyledGroupHeader.tsx';
import { StyledGroupItemWrapper } from '@/modules/core/components/virtuoso/StyledGroupItemWrapper.tsx';
import { dateTimeFormatter } from '@/util/DateHelper.ts';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { VirtuosoUtil } from '@/lib/virtuoso/Virtuoso.util.tsx';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { ChapterUpdateCard } from '@/modules/updates/components/ChapterUpdateCard.tsx';
import { useNavBarContext } from '@/modules/navigation-bar/contexts/NavbarContext.tsx';
import { Chapters } from '@/modules/chapter/services/Chapters.ts';
import { useAppTitleAndAction } from '@/modules/navigation-bar/hooks/useAppTitleAndAction.ts';
import { GROUPED_VIRTUOSO_Z_INDEX } from '@/lib/virtuoso/Virtuoso.constants.ts';

export const Updates: React.FC = () => {
    const { t } = useTranslation();
    const { appBarHeight } = useNavBarContext();

    const {
        data: chapterUpdateData,
        loading: isLoading,
        error,
        fetchMore,
        refetch,
    } = requestManager.useGetRecentlyUpdatedChapters(undefined, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });
    const hasNextPage = !!chapterUpdateData?.chapters.pageInfo.hasNextPage;
    const endCursor = chapterUpdateData?.chapters.pageInfo.endCursor;
    const updateEntries = chapterUpdateData?.chapters.nodes ?? [];
    const groupedUpdates = useMemo(
        () => Object.entries(Chapters.groupByDate(updateEntries, 'fetchedAt')),
        [updateEntries],
    );
    const groupCounts: number[] = useMemo(
        () => groupedUpdates.map((group) => group[VirtuosoUtil.ITEMS].length),
        [groupedUpdates],
    );

    const computeItemKey = VirtuosoUtil.useCreateGroupedComputeItemKey(
        groupCounts,
        useCallback((index) => groupedUpdates[index][VirtuosoUtil.GROUP], [groupedUpdates]),
        useCallback((index) => updateEntries[index].id, [updateEntries]),
    );

    const lastUpdateTimestampCompRef = useRef<HTMLElement>(null);
    const [lastUpdateTimestampCompHeight, setLastUpdateTimestampCompHeight] = useState(0);
    useLayoutEffect(() => {
        setLastUpdateTimestampCompHeight(lastUpdateTimestampCompRef.current?.clientHeight ?? 0);
    }, [lastUpdateTimestampCompRef.current]);

    const { data: lastUpdateTimestampData } = requestManager.useGetLastGlobalUpdateTimestamp({
        /**
         * The {@link UpdateChecker} is responsible for updating the timestamp
         */
        fetchPolicy: 'cache-only',
    });
    const lastUpdateTimestamp = lastUpdateTimestampData?.lastUpdateTimestamp.timestamp;

    useAppTitleAndAction(t('updates.title'), <UpdateChecker />);

    const loadMore = useCallback(() => {
        if (!hasNextPage) {
            return;
        }

        fetchMore({ variables: { offset: updateEntries.length } });
    }, [hasNextPage, endCursor]);

    if (error) {
        return (
            <EmptyViewAbsoluteCentered
                message={t('global.error.label.failed_to_load_data')}
                messageExtra={getErrorMessage(error)}
                retry={() => refetch().catch(defaultPromiseErrorHandler('Updates::refetch'))}
            />
        );
    }

    if (!isLoading && updateEntries.length === 0) {
        return <EmptyViewAbsoluteCentered message={t('updates.error.label.no_updates_available')} />;
    }

    return (
        <>
            <Typography
                ref={lastUpdateTimestampCompRef}
                sx={{
                    position: 'sticky',
                    top: appBarHeight,
                    zIndex: GROUPED_VIRTUOSO_Z_INDEX,
                    backgroundColor: 'background.default',
                    marginLeft: '10px',
                    paddingTop: (theme) => ({ [theme.breakpoints.up('sm')]: { paddingTop: '6px' } }),
                }}
            >
                {t('library.settings.global_update.label.last_update', {
                    date: lastUpdateTimestamp ? dateTimeFormatter.format(+lastUpdateTimestamp) : '-',
                })}
            </Typography>
            <StyledGroupedVirtuoso
                persistKey="updates"
                heightToSubtract={lastUpdateTimestampCompHeight}
                components={{
                    Footer: () => (isLoading ? <LoadingPlaceholder usePadding /> : null),
                }}
                overscan={window.innerHeight * 0.5}
                endReached={loadMore}
                groupCounts={groupCounts}
                groupContent={(index) => (
                    <StyledGroupHeader isFirstItem={index === 0}>
                        <Typography variant="h5" component="h2">
                            {groupedUpdates[index][VirtuosoUtil.GROUP]}
                        </Typography>
                    </StyledGroupHeader>
                )}
                computeItemKey={computeItemKey}
                itemContent={(index) => (
                    <StyledGroupItemWrapper>
                        <ChapterUpdateCard chapter={updateEntries[index]} />
                    </StyledGroupItemWrapper>
                )}
            />
        </>
    );
};
