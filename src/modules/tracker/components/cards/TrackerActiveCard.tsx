/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemButton from '@mui/material/ListItemButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PopupState, { bindDialog, bindMenu, bindTrigger } from 'material-ui-popup-state';
import { useMemo, useState } from 'react';
import Badge from '@mui/material/Badge';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { CustomTooltip } from '@/modules/core/components/CustomTooltip.tsx';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { Trackers } from '@/modules/tracker/services/Trackers.ts';
import { ListPreference } from '@/modules/source/components/sourceConfiguration/ListPreference.tsx';
import { NumberSetting } from '@/modules/core/components/settings/NumberSetting.tsx';
import { DateSetting } from '@/modules/core/components/settings/DateSetting.tsx';
import { makeToast } from '@/modules/core/utils/Toast.ts';
import { Menu } from '@/modules/core/components/menu/Menu.tsx';
import { CARD_STYLING, UNSET_DATE } from '@/modules/tracker/Tracker.constants.ts';
import { TypographyMaxLines } from '@/modules/core/components/texts/TypographyMaxLines.tsx';
import { SelectSetting, SelectSettingValue } from '@/modules/core/components/settings/SelectSetting.tsx';
import { CheckboxInput } from '@/modules/core/components/inputs/CheckboxInput.tsx';
import { TrackRecordType } from '@/lib/graphql/generated/graphql.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { TTrackerBind, TTrackRecordBind } from '@/modules/tracker/Tracker.types.ts';

const TrackerActiveLink = ({ children, url }: { children: React.ReactNode; url: string }) => (
    <Link href={url} rel="noreferrer" target="_blank" underline="none" color="inherit">
        {children}
    </Link>
);

type TTrackerActive = Pick<TTrackerBind, 'id' | 'name' | 'icon' | 'supportsTrackDeletion'>;
const TrackerActiveRemoveBind = ({
    trackerRecordId,
    tracker,
    onClick,
    onClose,
}: {
    trackerRecordId: TrackRecordType['id'];
    tracker: TTrackerActive;
    onClick: () => void;
    onClose: () => void;
}) => {
    const { t } = useTranslation();

    const [removeRemoteTracking, setRemoveRemoteTracking] = useState(false);

    const removeBind = () => {
        onClose();
        requestManager
            .unbindTracker(trackerRecordId, removeRemoteTracking)
            .response.then(() => makeToast(t('manga.action.track.remove.label.success'), 'success'))
            .catch((e) => makeToast(t('manga.action.track.remove.label.error'), 'error', getErrorMessage(e)));
    };

    return (
        <PopupState variant="dialog" popupId={`tracker-active-menu-remove-button-${tracker.id}`}>
            {(popupState) => (
                <>
                    <MenuItem
                        {...bindTrigger(popupState)}
                        onClick={() => {
                            onClick();
                            popupState.open();
                        }}
                    >
                        {t('global.button.remove')}
                    </MenuItem>
                    <Dialog
                        {...bindDialog(popupState)}
                        onClose={() => {
                            onClose();
                            popupState.close();
                        }}
                    >
                        <DialogTitle>
                            {t('manga.action.track.remove.dialog.label.title', { tracker: tracker.name })}
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography>{t('manga.action.track.remove.dialog.label.description')}</Typography>
                            {tracker.supportsTrackDeletion && (
                                <FormGroup>
                                    <CheckboxInput
                                        disabled={false}
                                        label={t('manga.action.track.remove.dialog.label.delete_remote_track', {
                                            tracker: tracker.name,
                                        })}
                                        checked={removeRemoteTracking}
                                        onChange={(_, checked) => setRemoveRemoteTracking(checked)}
                                    />
                                </FormGroup>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button
                                autoFocus
                                onClick={() => {
                                    popupState.close();
                                    onClose();
                                }}
                            >
                                {t('global.button.cancel')}
                            </Button>
                            <Button
                                onClick={() => {
                                    popupState.close();
                                    onClose();
                                    removeBind();
                                }}
                            >
                                {t('global.button.ok')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </PopupState>
    );
};

const TrackerUpdatePrivateStatus = ({
    trackRecordId,
    isPrivate,
    closeMenu,
}: {
    trackRecordId: TrackRecordType['id'];
    isPrivate: boolean;
    closeMenu: () => void;
}) => {
    const { t } = useTranslation();

    return (
        <MenuItem
            onClick={() => {
                requestManager
                    .updateTrackerBind(trackRecordId, { private: !isPrivate })
                    .response.catch((e) =>
                        makeToast(t('global.error.label.failed_to_save_changes'), 'error', getErrorMessage(e)),
                    );
                closeMenu();
            }}
        >
            {t(isPrivate ? 'tracking.action.button.track_publicly' : 'tracking.action.button.track_privately')}
        </MenuItem>
    );
};
type TTrackRecordActive = Pick<TTrackRecordBind, 'id' | 'remoteUrl' | 'title' | 'private'>;
const TrackerActiveHeader = ({
    trackRecord,
    tracker,
    openSearch,
}: {
    trackRecord: TTrackRecordActive;
    tracker: TTrackerActive;
    openSearch: () => void;
}) => {
    const { t } = useTranslation();

    return (
        <Stack
            direction="row"
            sx={{
                alignItems: 'stretch',
                paddingBottom: 2,
            }}
        >
            <Badge
                badgeContent={
                    trackRecord.private ? (
                        <Stack sx={{ p: '2px 6px', backgroundColor: 'primary.main', borderRadius: 100 }}>
                            <VisibilityOffIcon fontSize="small" sx={{ color: 'primary.contrastText' }} />
                        </Stack>
                    ) : null
                }
            >
                <TrackerActiveLink url={trackRecord.remoteUrl}>
                    <Avatar
                        alt={`${tracker.name}`}
                        src={requestManager.getValidImgUrlFor(tracker.icon)}
                        variant="rounded"
                        sx={{ width: 64, height: 64 }}
                    />
                </TrackerActiveLink>
            </Badge>

            <ListItemButton sx={{ flexGrow: 1 }} onClick={openSearch}>
                <CustomTooltip title={trackRecord.title}>
                    <TypographyMaxLines flexGrow={1} lines={1}>
                        {trackRecord.title}
                    </TypographyMaxLines>
                </CustomTooltip>
            </ListItemButton>
            <Stack
                sx={{
                    justifyContent: 'center',
                }}
            >
                <PopupState variant="popover" popupId={`tracker-active-menu-popup-${tracker.id}`}>
                    {(popupState) => (
                        <>
                            <IconButton {...bindTrigger(popupState)}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu {...bindMenu(popupState)} id={`tracker-active-menu-${tracker.id}`}>
                                {(onClose, setHideMenu) => [
                                    <TrackerActiveLink
                                        key={`tracker-active-menu-item-browser-${tracker.id}`}
                                        url={trackRecord.remoteUrl}
                                    >
                                        <MenuItem onClick={() => onClose()}>
                                            {t('global.label.open_in_browser')}
                                        </MenuItem>
                                    </TrackerActiveLink>,
                                    <TrackerActiveRemoveBind
                                        key={`tracker-active-menu-item-remove-${tracker.id}`}
                                        trackerRecordId={trackRecord.id}
                                        tracker={tracker}
                                        onClick={() => setHideMenu(true)}
                                        onClose={onClose}
                                    />,
                                    <TrackerUpdatePrivateStatus
                                        trackRecordId={trackRecord.id}
                                        isPrivate={trackRecord.private}
                                        closeMenu={onClose}
                                    />,
                                ]}
                            </Menu>
                        </>
                    )}
                </PopupState>
            </Stack>
        </Stack>
    );
};

const TrackerActiveCardInfoRow = ({ children }: { children: React.ReactNode }) => (
    <Stack direction="row" sx={{ textAlignLast: 'center' }}>
        {children}
    </Stack>
);

const isUnsetScore = (score: string | number): boolean => !Math.trunc(Number(score));

export const TrackerActiveCard = ({
    trackRecord,
    tracker,
    onClick,
}: {
    trackRecord: TTrackRecordBind;
    tracker: TTrackerBind;
    onClick: () => void;
}) => {
    const { t } = useTranslation();

    const isScoreUnset = isUnsetScore(trackRecord.displayScore);
    const currentScore = isScoreUnset ? tracker.scores[0] : trackRecord.displayScore;

    const selectSettingValues = useMemo(
        () =>
            tracker.scores.map(
                (score) =>
                    [score, { text: isUnsetScore(score) ? '-' : score }] satisfies SelectSettingValue<
                        TTrackerBind['scores'][number]
                    >,
            ),
        [tracker.scores],
    );

    const updateTrackerBind = (patch: Parameters<typeof requestManager.updateTrackerBind>[1]) => {
        requestManager
            .updateTrackerBind(trackRecord.id, patch)
            .response.catch((e) =>
                makeToast(t('global.error.label.failed_to_save_changes'), 'error', getErrorMessage(e)),
            );
    };

    return (
        <Card sx={CARD_STYLING}>
            <CardContent sx={{ padding: 0 }}>
                <TrackerActiveHeader trackRecord={trackRecord} tracker={tracker} openSearch={onClick} />
                <Card sx={{ backgroundColor: 'background.default' }}>
                    <CardContent sx={{ padding: '0' }}>
                        <Box sx={{ padding: 1 }}>
                            <TrackerActiveCardInfoRow>
                                <ListPreference
                                    ListPreferenceTitle={t('manga.label.status')}
                                    entries={tracker.statuses.map((status) => status.name)}
                                    key="status"
                                    type="ListPreference"
                                    entryValues={tracker.statuses.map((status) => `${status.value}`)}
                                    ListPreferenceCurrentValue={`${trackRecord.status}`}
                                    updateValue={(_, status) => updateTrackerBind({ status: Number(status) })}
                                    summary="%s"
                                />
                                <Divider orientation="vertical" flexItem />
                                <NumberSetting
                                    settingTitle={t('chapter.title_other')}
                                    dialogTitle={t('chapter.title_other')}
                                    settingValue={`${trackRecord.lastChapterRead}/${trackRecord.totalChapters}`}
                                    value={trackRecord.lastChapterRead}
                                    minValue={0}
                                    maxValue={Number.MAX_SAFE_INTEGER}
                                    valueUnit=""
                                    handleUpdate={(lastChapterRead) => updateTrackerBind({ lastChapterRead })}
                                />
                                <Divider orientation="vertical" flexItem />
                                <SelectSetting<string>
                                    settingName={t('tracking.track_record.label.score')}
                                    value={currentScore}
                                    values={selectSettingValues}
                                    handleChange={(score) => updateTrackerBind({ scoreString: score })}
                                />
                            </TrackerActiveCardInfoRow>
                            <Divider />
                            <TrackerActiveCardInfoRow>
                                <DateSetting
                                    settingName={t('tracking.track_record.label.start_date')}
                                    value={Trackers.getDateString(trackRecord.startDate)}
                                    remove
                                    handleChange={(startDate) =>
                                        updateTrackerBind({ startDate: startDate ?? UNSET_DATE })
                                    }
                                />
                                <Divider orientation="vertical" flexItem />
                                <DateSetting
                                    settingName={t('tracking.track_record.label.finish_date')}
                                    value={Trackers.getDateString(trackRecord.finishDate)}
                                    remove
                                    handleChange={(finishDate) =>
                                        updateTrackerBind({ finishDate: finishDate ?? UNSET_DATE })
                                    }
                                />
                            </TrackerActiveCardInfoRow>
                        </Box>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};
