/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import { TabsMenu } from '@/modules/core/components/tabs/TabsMenu.tsx';
import { ReaderService } from '@/modules/reader/services/ReaderService.ts';
import { MediaQuery } from '@/modules/core/utils/MediaQuery.tsx';
import { IReaderSettings, IReaderSettingsWithDefaultFlag } from '@/modules/reader/types/Reader.types.ts';
import { useReaderTapZoneContext } from '@/modules/reader/contexts/ReaderTapZoneContext.tsx';
import { applyStyles } from '@/modules/core/utils/ApplyStyles.ts';
import { READER_SETTING_TABS, ReaderSettingTab } from '@/modules/reader/constants/ReaderSettings.constants.tsx';
import { TabPanel } from '@/modules/core/components/tabs/TabPanel.tsx';
import { ReaderLayoutSettings } from '@/modules/reader/components/settings/layout/ReaderLayoutSettings.tsx';
import { ReaderGeneralSettings } from '@/modules/reader/components/settings/general/ReaderGeneralSettings.tsx';
import { ReaderFilterSettings } from '@/modules/reader/components/settings/filters/ReaderFilterSettings.tsx';
import { ReaderBehaviourSettings } from '@/modules/reader/components/settings/behaviour/ReaderBehaviourSettings.tsx';
import { ReaderDefaultLayoutSettings } from '@/modules/reader/components/settings/layout/ReaderDefaultLayoutSettings.tsx';
import { ReaderHotkeysSettings } from '@/modules/reader/components/settings/hotkeys/ReaderHotkeysSettings.tsx';
import { TReaderTapZoneContext } from '@/modules/reader/types/TapZoneLayout.types.ts';
import { withPropsFrom } from '@/modules/core/hoc/withPropsFrom.tsx';

const BaseReaderSettingsTabs = ({
    activeTab,
    setActiveTab,
    areDefaultSettings,
    settings,
    updateSetting,
    deleteSetting,
    setShowPreview,
    mode: overlayMode,
    setTransparent,
}: Pick<TReaderTapZoneContext, 'setShowPreview'> &
    Pick<ReturnType<typeof ReaderService.useOverlayMode>, 'mode'> & {
        activeTab: number;
        setActiveTab: (tab: number) => void;
        settings: IReaderSettingsWithDefaultFlag;
        updateSetting: (...args: OmitFirst<Parameters<typeof ReaderService.updateSetting>>) => void;
        areDefaultSettings?: boolean;
        deleteSetting: (setting: keyof IReaderSettings) => void;
        setTransparent?: (transparent: boolean) => void;
    }) => {
    const { t } = useTranslation();
    const isTouchDevice = MediaQuery.useIsTouchDevice();

    return (
        <>
            <TabsMenu
                value={activeTab}
                onChange={(_, newTab) => setActiveTab(newTab)}
                sx={{
                    ...applyStyles(!!areDefaultSettings, { zIndex: 2 }),
                    ...applyStyles(!areDefaultSettings, {
                        backgroundColor: 'background.paper',
                        backgroundImage: 'var(--Paper-overlay)',
                    }),
                }}
            >
                {Object.values(READER_SETTING_TABS).map(({ id, label, supportsTouchDevices }) => {
                    if (!supportsTouchDevices && isTouchDevice) {
                        return null;
                    }

                    return (
                        <Tab
                            key={id}
                            value={id}
                            label={t(label)}
                            sx={{ flexGrow: 1, maxWidth: 'unset', textTransform: 'none' }}
                        />
                    );
                })}
            </TabsMenu>
            <Box sx={{ p: areDefaultSettings ? undefined : 2, overflowX: 'hidden' }}>
                {Object.values(READER_SETTING_TABS).map(({ id, supportsTouchDevices }) => {
                    if (!supportsTouchDevices && isTouchDevice) {
                        return null;
                    }

                    switch (id as ReaderSettingTab) {
                        case ReaderSettingTab.LAYOUT:
                            if (areDefaultSettings) {
                                return (
                                    <TabPanel key={id} index={id} currentIndex={activeTab}>
                                        <ReaderDefaultLayoutSettings
                                            readingMode={settings.readingMode}
                                            updateSetting={(...args) => updateSetting(...args)}
                                        />
                                    </TabPanel>
                                );
                            }

                            return (
                                <TabPanel key={id} index={id} currentIndex={activeTab}>
                                    <ReaderLayoutSettings
                                        settings={settings}
                                        updateSetting={(...args) => updateSetting(...args)}
                                        setShowPreview={setShowPreview!}
                                        isDefaultable={!areDefaultSettings}
                                        onDefault={(...args) => deleteSetting?.(...args)}
                                        isSeriesMode
                                        setTransparent={setTransparent}
                                    />
                                </TabPanel>
                            );
                        case ReaderSettingTab.GENERAL:
                            return (
                                <TabPanel
                                    key={id}
                                    index={id}
                                    currentIndex={activeTab}
                                    sx={{ p: areDefaultSettings ? 2 : undefined }}
                                >
                                    <ReaderGeneralSettings
                                        overlayMode={overlayMode}
                                        settings={settings}
                                        updateSetting={(...args) => updateSetting(...args)}
                                        // @ts-expect-error - TS2322: Type boolean is not assignable to type true
                                        isDefaultable={!areDefaultSettings}
                                        onDefault={(...args) => deleteSetting?.(...args)}
                                    />
                                </TabPanel>
                            );
                        case ReaderSettingTab.FILTER:
                            return (
                                <TabPanel
                                    key={id}
                                    index={id}
                                    currentIndex={activeTab}
                                    sx={{ p: areDefaultSettings ? 2 : undefined }}
                                >
                                    <ReaderFilterSettings
                                        settings={settings}
                                        updateSetting={(...args) => updateSetting(...args)}
                                        isDefaultable
                                        onDefault={(...args) => deleteSetting?.(...args)}
                                        setTransparent={setTransparent}
                                    />
                                </TabPanel>
                            );
                        case ReaderSettingTab.BEHAVIOUR:
                            return (
                                <TabPanel
                                    key={id}
                                    index={id}
                                    currentIndex={activeTab}
                                    sx={{ p: areDefaultSettings ? 2 : undefined }}
                                >
                                    <ReaderBehaviourSettings
                                        settings={settings}
                                        updateSetting={(...args) => updateSetting(...args)}
                                        // @ts-expect-error - TS2322: Type boolean is not assignable to type true
                                        isDefaultable={!areDefaultSettings}
                                        onDefault={(...args) => deleteSetting?.(...args)}
                                    />
                                </TabPanel>
                            );
                        case ReaderSettingTab.HOTKEYS:
                            return (
                                <TabPanel
                                    key={id}
                                    index={id}
                                    currentIndex={activeTab}
                                    sx={{ p: areDefaultSettings ? 2 : undefined }}
                                >
                                    <ReaderHotkeysSettings
                                        settings={settings}
                                        updateSetting={(...args) => updateSetting(...args)}
                                        isDefaultable
                                        onDefault={(...args) => deleteSetting?.(...args)}
                                    />
                                </TabPanel>
                            );
                        default:
                            throw new Error(`Unexpected "ReaderSettingTab" (${id})`);
                    }
                })}
            </Box>
        </>
    );
};

export const ReaderSettingsTabs = withPropsFrom(
    BaseReaderSettingsTabs,
    [useReaderTapZoneContext, ReaderService.useOverlayMode],
    ['setShowPreview', 'mode'],
);
