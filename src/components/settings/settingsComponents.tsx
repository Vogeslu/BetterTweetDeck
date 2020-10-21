import {RendererOf} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';

export function makeSettingsRow<T extends keyof BTDSettings>(
  key: T,
  render: RendererOf<BTDSettings[T]>
) {
  return {
    render,
    id: key,
  };
}

export type SettingsRow<T extends keyof BTDSettings> = {
  render: RendererOf<BTDSettings[T]>;
  id: T;
};

export interface SettingsSection {
  id: string;
  content: readonly SettingsRow<keyof BTDSettings>[];
}
