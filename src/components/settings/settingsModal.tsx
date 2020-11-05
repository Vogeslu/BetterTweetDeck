import './settingsModal.css';

import {isEqual} from 'lodash';
import React, {Fragment, useCallback, useMemo, useState} from 'react';

import {Handler, HandlerOf, Renderer} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {AvatarsShape} from './components/avatarsShape';
import {BooleanSettingsRow} from './components/booleanSettingRow';
import {ColumnSettingsPreview} from './components/columnSettingsPreview';
import {CustomAccentColor} from './components/customAccentColor';
import {CustomDarkTheme} from './components/customDarkTheme';
import {ScrollbarsMode} from './components/scrollbarsMode';

interface SettingsModalProps {
  onOpenTDSettings: Handler;
  settings: BTDSettings;
  onSettingsUpdate: HandlerOf<BTDSettings>;
}

interface MenuItem {
  id: string;
  label: string;
  renderContent: Renderer;
}

export const SettingsModal = (props: SettingsModalProps) => {
  const {onSettingsUpdate, onOpenTDSettings} = props;
  const [settings, setSettings] = useState<BTDSettings>(props.settings);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(2);

  const makeOnSettingsChange = useCallback(
    <T extends keyof BTDSettings>(key: T) => {
      return (val: BTDSettings[T]) => {
        setSettings((currentSettings) => {
          return {
            ...currentSettings,
            [key]: val,
          };
        });
        setIsDirty(true);
      };
    },
    [setSettings, setIsDirty]
  );

  const updateSettings = useCallback(() => {
    onSettingsUpdate(settings);
    setIsDirty(false);
  }, [onSettingsUpdate, settings]);

  const canSave = useMemo(() => !isEqual(props.settings, settings) && isDirty, [
    isDirty,
    props.settings,
    settings,
  ]);

  const menu: readonly MenuItem[] = [
    {
      id: 'interface',
      label: 'Interface',
      renderContent: () => {
        return (
          <Fragment>
            <AvatarsShape
              initialValue={settings.avatarsShape}
              onChange={makeOnSettingsChange('avatarsShape')}></AvatarsShape>
            <BooleanSettingsRow
              settingsKey="badgesOnTopOfAvatars"
              initialValue={settings.badgesOnTopOfAvatars}
              onChange={makeOnSettingsChange('badgesOnTopOfAvatars')}>
              Show badges on top of avatars
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="collapseReadDms"
              initialValue={settings.collapseReadDms}
              onChange={makeOnSettingsChange('collapseReadDms')}>
              Collapse read DMs
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="disableGifsInProfilePictures"
              initialValue={settings.disableGifsInProfilePictures}
              onChange={makeOnSettingsChange('disableGifsInProfilePictures')}>
              Freeze GIFs in profile pictures
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="replaceHeartsByStars"
              initialValue={settings.replaceHeartsByStars}
              onChange={makeOnSettingsChange('replaceHeartsByStars')}>
              Replace hearts by stars
            </BooleanSettingsRow>
            <ScrollbarsMode
              initialValue={settings.scrollbarsMode}
              onChange={makeOnSettingsChange('scrollbarsMode')}></ScrollbarsMode>
          </Fragment>
        );
      },
    },
    {
      id: 'theme-tweaks',
      label: 'Theme tweaks',
      renderContent: () => (
        <Fragment>
          <CustomAccentColor
            initialValue={settings.customAccentColor}
            onChange={makeOnSettingsChange('customAccentColor')}></CustomAccentColor>
          <CustomDarkTheme
            initialValue={settings.customDarkTheme}
            onChange={makeOnSettingsChange('customDarkTheme')}></CustomDarkTheme>
        </Fragment>
      ),
    },
    {
      id: 'columns',
      label: 'Columns',
      renderContent: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              settingsKey="hideColumnIcons"
              initialValue={settings.hideColumnIcons}
              onChange={makeOnSettingsChange('hideColumnIcons')}>
              Hide icons on top of columns
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="showClearButtonInColumnsHeader"
              initialValue={settings.showClearButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showClearButtonInColumnsHeader')}>
              Show &quot;Clear&quot; button in columns&apos; header
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="showCollapseButtonInColumnsHeader"
              initialValue={settings.showCollapseButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showCollapseButtonInColumnsHeader')}>
              Show &quot;Collapse&quot; button in columns&apos; header
            </BooleanSettingsRow>
            <ColumnSettingsPreview settings={settings}></ColumnSettingsPreview>
          </Fragment>
        );
      },
    },
  ];

  return (
    <div className="btd-settings-modal">
      <header className="btd-settings-header">Better TweetDeck Settings</header>
      <aside className="btd-settings-sidebar">
        <ul>
          {menu.map((item, index) => {
            return (
              <li
                key={item.id}
                className={(selectedIndex === index && 'active') || ''}
                onClick={() => {
                  setSelectedIndex(index);
                }}>
                <div className="icon"></div>
                <div className="text">{item.label}</div>
              </li>
            );
          })}
        </ul>
      </aside>
      <section className="btd-settings-content">{menu[selectedIndex].renderContent()}</section>
      <footer className="btd-settings-footer">
        <button className="btd-settings-button secondary" onClick={onOpenTDSettings}>
          Open TweetDeck settings
        </button>
        <button
          className="btd-settings-button primary"
          onClick={updateSettings}
          disabled={!canSave}>
          Save
        </button>
      </footer>
    </div>
  );
};
